import * as S from './HeaderContentForBuyer.Style';
import HeaderLogoBox from '../../logo/HeaderLogoBox';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { HiShoppingCart } from 'react-icons/hi2';
import { useCartUI } from '@/hooks/useCartUI';
import { useCartItems } from '@/hooks/useCartItems';

const HeaderContentForBuyer: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useFirebaseAuth();
  const { toggleCart } = useCartUI();
  const { items } = useCartItems();

  return (
    <>
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
          {location.pathname === '/purchase' ? (
            <></>
          ) : (
            <S.CartButton onClick={toggleCart}>
              <HiShoppingCart size={30} />
              <S.LengthSpan>{items.length}</S.LengthSpan>
            </S.CartButton>
          )}
          <S.SignoutButton
            onClick={() => {
              if (confirm('로그아웃 하시겠습니까?')) logout();
            }}
          >
            로그아웃
          </S.SignoutButton>
        </S.HeaderMenuBox>
      </S.HeaderTopBox>
    </>
  );
};

export default HeaderContentForBuyer;
