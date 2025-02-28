import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRouteForSigning from './ProtectedRouteForSigning';
import Loading from '@/pages/loading/Loading';
import ProtectedRouteForMember from './ProtectedRouteForMember';

const Signin = lazy(() => import('@/pages/signin/Signin'));
const Signup = lazy(() => import('@/pages/signup/Signup'));
const Home = lazy(() => import('@/pages/buyer/home/Home'));
const Category = lazy(() => import('@/pages/buyer/category/Category'));
const History = lazy(() => import('@/pages/buyer/history/History'));
const Purchase = lazy(() => import('@/pages/buyer/purchase/Purchase'));
const Items = lazy(() => import('@/pages/seller/items/Items'));
const Management = lazy(() => import('@/pages/seller/management/Management'));
const Registration = lazy(
  () => import('@/pages/seller/registration/Registration'),
);
const Update = lazy(() => import('@/pages/seller/update/Update'));
const Detail = lazy(() => import('@/pages/buyer/detail/Detail'));
const NotFound = lazy(() => import('@/pages/notfound/NotFound'));

const MainRouter = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<ProtectedRouteForSigning />}>
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
        </Route>
        <Route element={<ProtectedRouteForMember />}>
          <Route path='/' element={<Home />} />
          <Route path='/category' element={<Category />} />
          <Route path='/detail/:id' element={<Detail />} />
          <Route path='/history' element={<History />} />
          <Route path='/purchase' element={<Purchase />} />
          <Route path='/items' element={<Items />} />
          <Route path='/management' element={<Management />} />
          <Route path='/registration' element={<Registration />} />
          <Route path='/update' element={<Update />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default MainRouter;
