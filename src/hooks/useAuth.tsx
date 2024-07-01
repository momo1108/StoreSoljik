import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from 'react';
import { auth, db } from '@/firebase';
import { User, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface UserInfo {
  uid: string;
  email: string;
  accountType: '구매자' | '판매자';
  nickname: string;
}

interface AuthContextProps {
  userInfo: UserInfo | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  userInfo: null,
  loading: true,
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
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const handleUser = async (user: User | null) => {
    if (user) {
      if (user.displayName === null) {
        try {
          const userDocument = await getDoc(doc(db, 'user', user.uid));
          if (userDocument.exists()) {
            const userData = userDocument.data();
            await updateProfile(auth.currentUser as User, {
              displayName: `${userData.nickname}#${userData.accountType}`,
            });
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        const userInfo = formatUser(user);
        setLoading(false);
        setUserInfo(userInfo);
      }
    } else {
      setLoading(false);
      setUserInfo(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleUser);

    return () => unsubscribe();
  }, []);

  return {
    userInfo,
    loading,
  };
};

const formatUser = (user: User): UserInfo => {
  const nicknameAndAccountType = user.displayName!.split('#');
  return {
    uid: user.uid,
    email: user.email!,
    nickname: nicknameAndAccountType[0],
    accountType: nicknameAndAccountType[1] as '구매자' | '판매자',
  };
};
