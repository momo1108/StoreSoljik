import { Route, Routes } from 'react-router-dom';
import ProtectedRouteForUser from './ProtectedRouteForUser';
import Home from '@/pages/home/Home';
import Signin from '@/pages/signin/Signin';
import Signup from '@/pages/signup/Signup';
import ProtectedRouteForSeller from './ProtectedRouteForSeller';
import Category from '@/pages/category/Category';
import History from '@/pages/history/History';
import Purchase from '@/pages/purchase/Purchase';
import Items from '@/pages/seller/items/Items';
import Management from '@/pages/seller/management/Management';
import Registration from '@/pages/seller/registration/Registration';

const MainRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/signin' element={<Signin />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/category' element={<Category />} />
      <Route element={<ProtectedRouteForUser />}>
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
