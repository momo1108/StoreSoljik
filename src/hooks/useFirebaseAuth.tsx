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
  Unsubscribe,
  User,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { DocumentData } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AccountType = '구매자' | '판매자';

const SESSION_INTERVAL = 1 * 60 * 1000; // 3시간 뒤 체크
const SESSION_OFFSET = 30 * 1000; // 5분 뒤까지 유지

export interface UserInfo {
  uid: string;
  email: string;
  accountType: AccountType;
  nickname: string;
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

interface AuthProviderProps {
  children: ReactNode;
}

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
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const unsubscribeAuthState = useRef<Unsubscribe | null>(null);
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setSessionTimer = useCallback(
    (
      uid: string,
      timestamp: number = SESSION_INTERVAL,
      isSettingLocalStorage: boolean = false,
    ) => {
      // 기존 타이머 클리어
      if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);
      // 3시간 후 자동 로그아웃
      sessionTimeoutRef.current = setTimeout(() => {
        confirmSessionKeepAlive(uid);
      }, timestamp);
      if (isSettingLocalStorage)
        localStorage.setItem(
          `sessionTimestamp:${uid}`,
          (Date.now() + SESSION_INTERVAL + SESSION_OFFSET).toString(),
        );
    },
    [],
  );

  /** ✅ 세션 유지 여부를 묻고, 동기화하는 함수 */
  const confirmSessionKeepAlive = (uid: string) => {
    console.log('⚠️ 세션 유지 여부 확인');
    if (document.hasFocus())
      toast('로그인 상태를 유지하시겠습니까?', {
        description:
          '이 알림은 로그인 시 "로그인 유지" 를 체크하지 않은 경우 3시간 간격으로 출력되며, 응답이 없을 시 자동으로 로그아웃됩니다.',
        action: {
          label: '유지',
          onClick: () => setSessionTimer(uid),
        },
        onAutoClose: () => logout(),
        duration: 15000,
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
    const storedTimestamp = localStorage.getItem(`sessionTimestamp:${uid}`);
    const remainTimestamp = storedTimestamp
      ? parseInt(storedTimestamp) - Date.now()
      : 0;

    setSessionTimer(
      uid,
      remainTimestamp > 0 ? remainTimestamp : SESSION_INTERVAL,
      true,
    );
  };

  const handleStorageChange = (event: StorageEvent) => {
    console.log(event);
    const uid = auth.currentUser!.uid;
    if (event.key === `sessionTimestamp:${uid}`) {
      console.log('🔄 다른 창에서 세션 유지 선택됨 → 3시간 타이머 재시작');
      setSessionTimer(uid);
    }
  };

  const logout = () => {
    localStorage.removeItem(`sessionTimestamp:${auth.currentUser!.uid}`);
    signOut(auth);
    setUserInfo(null);
    if (unsubscribeAuthState.current) {
      unsubscribeAuthState.current();
      unsubscribeAuthState.current = null;
    }
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = null;
    }
    window.removeEventListener('storage', handleStorageChange);
  };

  const handleUser = async (user: User | null) => {
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
      setLoading(false);
      setUserInfo(userInfo);

      startSessionTimer(userInfo.uid);
      window.addEventListener('storage', handleStorageChange);

      if (location.pathname === '/signup' || location.pathname === '/signin') {
        navigate('/');
      }
    } else {
      setLoading(false);
      setUserInfo(null);
      if (!['/signin', '/signup', '/setting'].includes(location.pathname)) {
        navigate('/signin');
      }
    }
  };

  useEffect(() => {
    unsubscribeAuthState.current = onAuthStateChanged(auth, handleUser);

    return () => {
      if (unsubscribeAuthState.current) {
        unsubscribeAuthState.current();
        unsubscribeAuthState.current = null;
      }
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
        sessionTimeoutRef.current = null;
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
