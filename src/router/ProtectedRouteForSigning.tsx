import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import Loading from '@/pages/loading/Loading';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRouteForSigning = () => {
  const { userInfo, loading } = useFirebaseAuth();

  return loading ? (
    <Loading />
  ) : userInfo === null ? (
    <Outlet />
  ) : (
    <Navigate to='/' replace={true} />
  );
};

export default ProtectedRouteForSigning;
