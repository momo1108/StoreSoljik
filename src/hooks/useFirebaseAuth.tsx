import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
  useRef,
  useCallback,
  MutableRefObject,
} from 'react';
import { auth } from '@/firebase';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { DocumentData } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AccountType = '구매자' | '판매자';

const SESSION_INTERVAL = 1 * 60 * 1000; // 3시간 뒤 체크
const SESSION_WARNING_OFFSET = 30 * 1000; // 5분 뒤까지 유지
const SESSION_WARNING_DURATION = 15 * 1000; // 5분 뒤까지 유지

export interface UserInfo {
  uid: string;
  email: string;
  accountType: AccountType;
  nickname: string;
}

type LoginInfo = {
  email: string;
  password: string;
  isMaintainingSession: boolean;
};

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextProps {
  userInfo: UserInfo | null;
  loading: boolean;
  logout: () => void;
  authChannel: BroadcastChannel | null;
  loginInfoRef: MutableRefObject<LoginInfo>;
}

const AuthContext = createContext<AuthContextProps>({
  userInfo: null,
  loading: true,
  logout: () => {},
  authChannel: null,
  loginInfoRef: {
    current: {
      email: '',
      password: '',
      isMaintainingSession: false,
    },
  },
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const authObject = useProvideAuth();

  return (
    <AuthContext.Provider value={authObject}>{children}</AuthContext.Provider>
  );
};

export const useFirebaseAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      'useFirebaseAuth 는 AuthProvider 내부에서만 사용이 가능합니다.',
    );
  }
  return context;
};

/**
 * onAuthStateChanged 메서드를 활용해 세션 초기화가 완료되면 state 로 저장합니다.
 * @returns 유저 정보와 세션 로딩 상태
 */
const useProvideAuth = () => {
  let authChannel = new BroadcastChannel('auth');
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  /**
   * 로그인 페이지를 여러탭에서 동시에 켜놓는 경우, 로그인한 탭이 로그인 후 다시 로그인페이지로 이동되는 이슈를 발견(하나의 탭만 사용하면 문제없음)
   * 로그인한 탭에서 onAuthStateChanged 의 옵저버 메서드가 로그인된 user 객체로 실행된 후 null 객체로 다시 실행되는 것이 원인이라고 판단
   * 다른 탭에서는 user 객체로만 옵저버 메서드가 실행됨
   * 로그인 시에만 옵저버 메서드에 null 객체가 잘못전달되는것을 감지하기 위해 로그인, 로그아웃 시에만 변경할 isSignedIn 플래그를 사용한다
   * state 는 비동기 업데이트이므로 useRef 를 사용해 동기 업데이트가 되도록 한다
   * 옵저버 메서드에서 isSignedIn 플래그가 true 이면 null 객체가 와도 로그인된 상태로 판단하고 페이지를 이동하지 않도록 조치
   * 이 플래그로 인해 로그아웃 시 다른 탭들이 자동으로 로그인페이지로 리다이렉트가 안됨. (직접 네비게이트 혹은 리로드?)
   */
  const isSignedInRef = useRef<boolean>(false);
  const loginInfoRef = useRef<LoginInfo>({
    email: '',
    password: '',
    isMaintainingSession: false,
  });
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sessionAlarmRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 세션 유지 알람의 "타이머"를 설정한다.
   *
   * @param uid - Firebase Authentication 의 회원 uid.
   * @param timestamp - 로그아웃 타이머, 알람 타이머에 활용될 타임스탬프(기본값은 SESSION_INTERVAL 을 참조)
   * - localStorage 에 이미 저장된 로그아웃 타임스탬프가 있는 경우에 시간을 직접 설정하게 된다
   * @param isSettingLocalStorage - localStorage 의 타임아웃 타임스탬프 수정 여부.
   * - 브라우저 윈도우에서 초기 타이머 세팅 시 사용
   */
  const setSessionTimer = useCallback(
    ({
      uid,
      timestamp = SESSION_INTERVAL,
      isSettingLocalStorage = false,
    }: {
      uid: string;
      timestamp?: number;
      isSettingLocalStorage?: boolean;
    }) => {
      // 기존 타이머 클리어
      if (sessionAlarmRef.current) clearTimeout(sessionAlarmRef.current);
      if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);

      // 3시간 후 자동 로그아웃
      sessionAlarmRef.current = setTimeout(() => {
        confirmSessionKeepAlive(uid);
      }, timestamp - SESSION_WARNING_OFFSET);
      sessionTimeoutRef.current = setTimeout(() => {
        logout();
      }, timestamp);

      if (isSettingLocalStorage)
        localStorage.setItem(
          `sessionTimestamp:${uid}`,
          (Date.now() + SESSION_INTERVAL + SESSION_WARNING_OFFSET).toString(),
        );
    },
    [],
  );

  /**
   * toast 의 action 을 사용해 사용자의 세션 유지 여부를 입력받는 메서드. focus 가 활성화됐을때만 toast 를 띄우고 아닌 경우 {@link setSessionTimer} 에서 설정한 타임아웃을 통해
   */
  const confirmSessionKeepAlive = (uid: string) => {
    console.log('⚠️ 세션 유지 여부 확인');
    toast('로그인 상태를 유지하시겠습니까?', {
      description:
        '이 알림은 로그인 시 "로그인 유지" 를 체크하지 않은 경우 3시간 간격으로 출력되며, 응답이 없을 시 자동으로 로그아웃됩니다.',
      action: {
        label: '유지',
        onClick: () => setSessionTimer({ uid, isSettingLocalStorage: true }),
      },
      duration: SESSION_WARNING_DURATION,
      closeButton: false,
    });
  };

  /** 웹브라우저 윈도우 별 초기 타이머 설정 메서드
   * 접속 시 유저 정보가 있으며, localstorage 에 세션 유지 기간 정보가
   * - 존재한다 : 세션 유지 기간이
   *    - 남아있다 : 최근(3시간 이내)에 다른 창이 켜져있었다는 뜻이므로, 해당 시간에 맞춰 세션 연장 알림 타이머를 설정한다
   *    - 남아있지 않다 : 지금으로부터 3시간 뒤를 새로운 세션 유지 기간으로 설정하고, 타이머를 설정한다.
   * - 존재하지 않는다 : 지금으로부터 3시간 뒤를 새로운 세션 유지 기간으로 설정하고, 타이머를 설정한다.
   */
  const startSessionTimer = (uid: string) => {
    console.log('start timer');
    const storedTimestamp = parseInt(
      localStorage.getItem(`sessionTimestamp:${uid}`) || '0',
    );
    const remainTimestamp = storedTimestamp - Date.now();
    const isResetting: boolean = remainTimestamp <= SESSION_WARNING_OFFSET;

    setSessionTimer({
      uid,
      timestamp: isResetting ? SESSION_INTERVAL : remainTimestamp,
      isSettingLocalStorage: isResetting,
    });
  };

  const handleStorageChange = (event: StorageEvent) => {
    // console.log(event);
    const uid = auth.currentUser!.uid;
    if (event.key === `sessionTimestamp:${uid}`) {
      console.log('🔄 다른 창에서 세션 유지 선택됨 → 3시간 타이머 재시작');
      setSessionTimer({ uid });
    }
  };

  const logout = () => {
    window.removeEventListener('storage', handleStorageChange);
    localStorage.removeItem(`sessionTimestamp:${auth.currentUser!.uid}`);
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = null;
    }
    if (sessionAlarmRef.current) {
      clearTimeout(sessionAlarmRef.current);
      sessionAlarmRef.current = null;
    }
    isSignedInRef.current = false;
    setUserInfo(null);
    authChannel.postMessage({ type: 'LOGOUT' });
    signOut(auth);
  };

  const handleUser = async (user: User | null) => {
    console.log(user);
    /**
     * 이 핸들러에서 모든 회원가입 / 로그인 처리를 하기위해 닉네임은 따로 입력받지 않고 이메일과 동일한 값이나 써드파티의 닉네임으로만 설정
     * 깃헙과 구글에 같은 이메일 계정을 사용하는 경우, 깃헙으로 가입을 해도 구글 로그인을 시도하면 구글 계정으로 변환되는 이슈를 확인
     */
    if (user) {
      if (!user.displayName) {
        let providerData = user.providerData[0];
        await updateProfile(user, {
          displayName:
            providerData.displayName ||
            providerData.email ||
            `${providerData.uid}@${providerData.providerId}`,
        });
      }

      const userInfo = formatUser(user, 'User');
      if (
        !loginInfoRef.current.isMaintainingSession &&
        !isSignedInRef.current
      ) {
        startSessionTimer(userInfo.uid);
      }
      isSignedInRef.current = true;
      setLoading(false);
      setUserInfo(userInfo);

      window.addEventListener('storage', handleStorageChange);

      if (location.pathname === '/signup' || location.pathname === '/signin') {
        navigate('/');
      }
    } else {
      setLoading(false);
      if (!isSignedInRef.current) {
        if (!['/signin', '/signup'].includes(location.pathname)) {
          navigate('/signin');
        }
      } else {
        signInWithEmailAndPassword(
          auth,
          loginInfoRef.current.email,
          loginInfoRef.current.password,
        );
      }
    }
  };

  useEffect(() => {
    console.log('firebaseauth useeffect start');
    const isMaintaingSession = localStorage.getItem('soljik_maintain_session');
    loginInfoRef.current.isMaintainingSession = !!isMaintaingSession;
    console.log(loginInfoRef.current);
    authChannel = new BroadcastChannel('auth'); // 개발 환경에서는 다시 초기화해야 정상 동작함
    const unsubscribeAuthChange = onAuthStateChanged(auth, handleUser);

    authChannel.onmessage = (event) => {
      if (event.data.type === 'LOGIN') {
        console.log('🔄 다른 탭에서 로그인 감지');
        if (
          !auth?.currentUser &&
          ['/signin', '/signup'].includes(location.pathname)
        )
          location.reload();
      } else if (event.data.type === 'LOGOUT') {
        console.log('🔄 다른 탭에서 로그아웃 감지');
        logout();
      }
    };

    return () => {
      console.log('firebaseauth useeffect return');
      unsubscribeAuthChange();
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
        sessionTimeoutRef.current = null;
      }
      if (sessionAlarmRef.current) {
        clearTimeout(sessionAlarmRef.current);
        sessionAlarmRef.current = null;
      }
      window.removeEventListener('storage', handleStorageChange);
      authChannel.close();
    };
  }, []);

  return {
    userInfo,
    loading,
    logout,
    authChannel,
    loginInfoRef,
  };
};

const formatUser = (
  userData: DocumentData | User,
  type: 'DocumentData' | 'User',
): UserInfo => {
  if (type === 'DocumentData') {
    return {
      uid: (userData as DocumentData).uid,
      email: (userData as DocumentData).email || '',
      nickname: (userData as DocumentData).nickname,
      accountType: (userData as DocumentData).accountType,
    };
  } else {
    const displayName = (userData as User).displayName as string;
    const [nickname, accountType] = displayName.split('#');
    return {
      uid: (userData as User).uid,
      email: (userData as User).email || '',
      nickname,
      accountType: accountType as AccountType,
    };
  }
};
