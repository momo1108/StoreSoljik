import { useAuth } from '@/hooks/useAuth';
import Loading from '@/pages/loading/Loading';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRouteForBuyer = () => {
  const { userInfo, loading } = useAuth();

  return loading ? (
    <Loading />
  ) : userInfo === null ? (
    <Navigate to='/signin' replace={true} />
  ) : userInfo.accountType === '판매자' ? (
    <Navigate to='/items' replace={true} />
  ) : (
    <Outlet />
  );
};

export default ProtectedRouteForBuyer;
