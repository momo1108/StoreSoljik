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
  onIdTokenChanged,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { DocumentData } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AccountType = '구매자' | '판매자';

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
  const unsubscribeIdToken = useRef<Unsubscribe | null>(null);

  const logout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      if (auth.currentUser) localStorage.removeItem(auth.currentUser.uid);
      signOut(auth);
      setUserInfo(null);

      if (unsubscribeAuthState.current) {
        unsubscribeAuthState.current();
        unsubscribeAuthState.current = null;
      }
      if (unsubscribeIdToken.current) {
        unsubscribeIdToken.current();
        unsubscribeIdToken.current = null;
      }
    }
  };

  const handleUser = async (user: User | null) => {
    /**
     * 이 핸들러에서 모든 회원가입 / 로그인 처리를 하기위해 닉네임은 따로 입력받지 않고 이메일과 동일한 값이나 써드파티의 닉네임으로만 설정
     * 깃헙과 구글에 같은 이메일 계정을 사용하는 경우, 깃헙으로 가입을 해도 구글 로그인을 시도하면 구글 계정으로 변환되는 이슈를 확인
     */
    if (user) {
      const tokenResult = await user.getIdTokenResult();
      console.dir(tokenResult);
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
      if (unsubscribeIdToken.current) {
        unsubscribeIdToken.current();
        unsubscribeIdToken.current = null;
      }
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
