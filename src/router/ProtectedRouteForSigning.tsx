import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import Loading from '@/pages/loading/Loading';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRouteForSigning = () => {
  const { userInfo, loading } = useFirebaseAuth();

  return loading ? (
    <Loading />
  ) : userInfo === null ? (
    <Outlet />
  ) : userInfo.accountType === '구매자' ? (
    <Navigate to='/' replace={true} />
  ) : (
    <Navigate to='/items' replace={true} />
  );
};

export default ProtectedRouteForSigning;
