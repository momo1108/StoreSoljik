import { auth } from '@/firebase';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRouteForUser = () => {
  const { userInfo, loading } = useAuth();
  console.log(userInfo, loading);

  return auth.currentUser ? <Outlet /> : <Navigate to='/' replace={true} />;
};

export default ProtectedRouteForUser;
