import { useAuth } from '@/hooks/useAuth';
import Loading from '@/pages/loading/Loading';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRouteForUser = () => {
  const { userInfo, loading } = useAuth();

  return loading ? (
    <Loading />
  ) : userInfo === null ? (
    <Navigate to='/signin' replace={true} />
  ) : userInfo.accountType === '구매자' ? (
    <Navigate to='/' replace={true} />
  ) : (
    <Outlet />
  );
};

export default ProtectedRouteForUser;
