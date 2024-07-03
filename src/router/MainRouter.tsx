import { Route, Routes } from 'react-router-dom';
import Signin from '@/pages/signin/Signin';
import Signup from '@/pages/signup/Signup';
import Home from '@/pages/buyer/home/Home';
import Category from '@/pages/buyer/category/Category';
import History from '@/pages/buyer/history/History';
import Purchase from '@/pages/buyer/purchase/Purchase';
import Items from '@/pages/seller/items/Items';
import Management from '@/pages/seller/management/Management';
import Registration from '@/pages/seller/registration/Registration';
import ProtectedRouteForSigning from './ProtectedRouteForSigning';
import ProtectedRouteForBuyer from './ProtectedRouteForBuyer';
import ProtectedRouteForSeller from './ProtectedRouteForSeller';

const MainRouter = () => {
  return (
    <Routes>
      <Route element={<ProtectedRouteForSigning />}>
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
      </Route>
      <Route element={<ProtectedRouteForBuyer />}>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/category' element={<Category />} />
        <Route path='/history' element={<History />} />
        <Route path='/purchase' element={<Purchase />} />
      </Route>
      <Route element={<ProtectedRouteForSeller />}>
        <Route path='/items' element={<Items />} />
        <Route path='/management' element={<Management />} />
        <Route path='/registration' element={<Registration />} />
      </Route>
    </Routes>
  );
};

export default MainRouter;
