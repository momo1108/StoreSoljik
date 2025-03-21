import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
  useRef,
  useCallback,
} from 'react';
import { auth } from '@/firebase';
import {
  User,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { DocumentData } from 'firebase/firestore';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

type AccountType = '구매자' | '판매자';

const SESSION_INTERVAL = 3 * 60 * 60 * 1000; // 3시간 뒤 체크
const SESSION_WARNING_OFFSET = 5 * 60 * 1000; // 5분 뒤까지 유지
const SESSION_WARNING_DURATION = 15 * 1000; // 5분 뒤까지 유지

export interface UserInfo {
  uid: string;
  email: string;
  accountType: AccountType;
  nickname: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextProps {
  userInfo: UserInfo | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  userInfo: null,
  loading: true,
  logout: () => {},
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
  const queryClient = useQueryClient();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // 라우터에서 사용될 로딩 state
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
          (Date.now() + SESSION_INTERVAL).toString(),
        );
    },
    [],
  );

  /**
   * toast 의 action 을 사용해 사용자의 세션 유지 여부를 입력받는 메서드.
   * action 옵션을 활용해 유지 버튼을 클릭 시 {@link setSessionTimer} 세션 타이머를 초기화한한다.
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

  /**
   * LocalStorage 에서 변화가 발생하는 경우의 이벤트 핸들러
   * 특정 유저의 uid 를 포함한 key 값을 사용한다.
   * Key 형태 : "sessionTimestamp:uid"
   * @param event LocalStorage 의 이벤트 객체
   */
  const handleStorageChange = (event: StorageEvent) => {
    // console.log(event);
    const uid = auth.currentUser!.uid;
    if (event.key === `sessionTimestamp:${uid}`) {
      // console.log('🔄 다른 창에서 세션 유지 선택됨 → 3시간 타이머 재시작');
      setSessionTimer({ uid });
    }
  };

  const logout = () => {
    // 계정에 관련된 캐시들 초기화(items, history)
    queryClient.clear();

    // 세션 관련 초기화
    window.removeEventListener('storage', handleStorageChange);
    if (auth.currentUser)
      localStorage.removeItem(`sessionTimestamp:${auth.currentUser.uid}`);
    localStorage.removeItem('soljik_maintain_session');
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = null;
    }
    if (sessionAlarmRef.current) {
      clearTimeout(sessionAlarmRef.current);
      sessionAlarmRef.current = null;
    }
    setUserInfo(null);
    signOut(auth);
  };

  const getIsMaintainingSession = () => {
    return !!localStorage.getItem('soljik_maintain_session');
  };

  const handleUser = async (user: User | null) => {
    console.log(user);
    /**
     * 이 핸들러에서 모든 회원가입 / 로그인 처리를 하기위해 닉네임은 따로 입력받지 않고 이메일과 동일한 값이나 써드파티의 닉네임으로만 설정
     * 깃헙과 구글에 같은 이메일 계정을 사용하는 경우, 깃헙으로 가입을 해도 구글 로그인을 시도하면 구글 계정으로 변환되는 이슈를 확인
     */
    if (user) {
      const expiredDate = localStorage.getItem(`sessionTimestamp:${user.uid}`);
      if (expiredDate && parseInt(expiredDate) <= Date.now()) {
        logout();
        return;
      }

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
      if (!getIsMaintainingSession()) {
        startSessionTimer(userInfo.uid);
      }
      setLoading(false);
      setUserInfo(userInfo);

      window.addEventListener('storage', handleStorageChange);
    } else {
      setLoading(false);
      setUserInfo(null);
    }
  };

  useEffect(() => {
    console.log('firebaseauth useeffect start');
    const unsubscribeAuthChange = onAuthStateChanged(auth, handleUser);

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
    };
  }, []);

  return {
    userInfo,
    loading,
    logout,
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
