import { auth } from '@/firebase';
import { Navigate, Outlet } from 'react-router-dom';

export default function AuthProtectedRoute() {
  console.log(auth);
  return auth.currentUser ? (
    <Outlet />
  ) : (
    <Navigate to='/signin' replace={true} />
  );
}
