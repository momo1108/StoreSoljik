import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
  useRef,
} from 'react';
import { auth, db } from '@/firebase';
import {
  User,
  deleteUser,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { DocumentData, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';

type AccountType = '구매자' | '판매자';

interface UserInfo {
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

export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * onAuthStateChanged 메서드를 활용해 세션 초기화가 완료되면 state 로 저장합니다.
 * @returns 유저 정보와 세션 로딩 상태
 */
const useProvideAuth = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const isSignedIn = useRef<boolean>(false);

  const logout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      signOut(auth);
      isSignedIn.current = false;
    }
  };

  const handleUser = async (user: User | null) => {
    if (user) {
      /**
       * 유저 정보는 있는데 displayName 이 없는 경우
       * 1. 회원가입 클릭 직후, 아직 displayName 세팅이 안된 시점
       * 2. 회원가입까지만 성공하고, updateProfile 은 실패한 경우
       */
      if (user.displayName === null) {
        try {
          const userDocument = await getDoc(doc(db, 'user', user.uid));
          let userInfo = null;
          if (userDocument.exists()) {
            const userData = userDocument.data();
            await updateProfile(user, {
              displayName: `${userData.nickname}#${userData.accountType}`,
            });
            userInfo = formatUser(userData, 'DocumentData');
          } else {
            throw new Error('사용자 데이터가 없습니다.');
          }
          setLoading(false);
          setUserInfo(userInfo);
          isSignedIn.current = true;
          /**
           * 1. 회원가입 직후 유저 객체 세팅 후
           * 2. 회원가입 직후 유저 객체 세팅 실패. catch 에서 아이디 삭제까지 실패한 후 나중에 다시 로그인.
           */
          if (
            location.pathname === '/signup' ||
            location.pathname === '/signin'
          ) {
            navigate(userInfo.accountType === '구매자' ? '/' : '/items');
          }
        } catch (error: unknown) {
          console.log(error);
          /**
           * updateProfile 실패하든말든 일단 사용자 삭제 시도
           */
          if (error instanceof FirebaseError && auth.currentUser) {
            await deleteDoc(doc(db, 'user', auth.currentUser.uid));
            await deleteUser(auth.currentUser);
          }
          alert('가입에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        const userInfo = formatUser(user, 'User');
        setLoading(false);
        setUserInfo(userInfo);
        isSignedIn.current = true;
      }
    } else if (!isSignedIn.current) {
      setLoading(false);
      setUserInfo(null);
      if (!['/signin', '/signup'].includes(location.pathname)) {
        navigate('/signin');
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleUser);

    return () => unsubscribe();
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
      email: (userData as DocumentData).email,
      nickname: (userData as DocumentData).nickname,
      accountType: (userData as DocumentData).accountType,
    };
  } else {
    const displayName = (userData as User).displayName as string;
    const [nickname, accountType] = displayName.split('#');
    return {
      uid: (userData as User).uid,
      email: (userData as User).email!,
      nickname,
      accountType: accountType as AccountType,
    };
  }
};
