import Cart from '@/components/ui/cart/Cart';
import { CartItemsProvider } from '@/hooks/useCartItems';
import { CartUIProvider } from '@/hooks/useCartUI';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import Loading from '@/pages/loading/Loading';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRouteForMember = () => {
  const { userInfo, loading } = useFirebaseAuth();

  return loading ? (
    <Loading />
  ) : userInfo === null ? (
    <Navigate to='/signin' replace={true} />
  ) : (
    <CartUIProvider>
      <CartItemsProvider>
        <Outlet />
        <Cart />
      </CartItemsProvider>
    </CartUIProvider>
  );
};

export default ProtectedRouteForMember;
