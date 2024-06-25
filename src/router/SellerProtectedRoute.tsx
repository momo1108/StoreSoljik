import { auth } from '@/firebase';
import { Navigate, Outlet } from 'react-router-dom';

export default function SellerProtectedRoute() {
  console.log(auth);
  return auth.currentUser ? <Outlet /> : <Navigate to='/' replace={true} />;
}
