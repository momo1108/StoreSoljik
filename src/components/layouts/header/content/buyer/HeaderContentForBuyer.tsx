import * as S from './HeaderContentForBuyer.Style';
import HeaderLogoBox from '../../logo/HeaderLogoBox';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { HiShoppingCart } from 'react-icons/hi2';
import { useCartUIActions } from '@/hooks/useCartUI';
import { useCartItemsState } from '@/hooks/useCartItems';

const CartButton: React.FC = () => {
  const { toggleCart } = useCartUIActions();
  const { items } = useCartItemsState();

  return location.pathname === '/purchase' ? (
    <></>
  ) : (
    <S.CartButton onClick={toggleCart}>
      <HiShoppingCart size={30} />
      <S.LengthSpan>{items.length}</S.LengthSpan>
    </S.CartButton>
  );
};
const HeaderContentForBuyer: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useFirebaseAuth();

  return (
    <S.HeaderTopBox>
      <HeaderLogoBox
        isPointer={true}
        onClick={() => {
          navigate('/');
        }}
      ></HeaderLogoBox>
      <S.HeaderNavBox>
        <S.HeaderNavBar
          navData={[
            { name: '홈페이지', path: '/' },
            { name: '카테고리별 상품', path: '/category' },
            { name: '구매내역', path: '/history' },
          ]}
        />
      </S.HeaderNavBox>
      <S.HeaderMenuBox>
        <CartButton />
        <S.SellerPageLink to={'/items'}>판매자 페이지</S.SellerPageLink>
        <S.SignoutButton
          onClick={() => {
            if (confirm('로그아웃 하시겠습니까?')) logout();
          }}
        >
          로그아웃
        </S.SignoutButton>
      </S.HeaderMenuBox>
    </S.HeaderTopBox>
  );
};

export default HeaderContentForBuyer;
