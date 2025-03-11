import * as S from './HeaderContentForSeller.Style';
import HeaderLogoBox from '../../logo/HeaderLogoBox';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

const HeaderContentForSeller: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useFirebaseAuth();

  return (
    <>
      <S.HeaderTopBox>
        <HeaderLogoBox
          isPointer={true}
          onClick={() => {
            navigate('/items');
          }}
        ></HeaderLogoBox>
        <S.HeaderNavBox>
          <S.HeaderNavBar
            navData={[
              { name: '판매 상품 관리', path: '/items' },
              { name: '주문 상태 관리', path: '/management' },
              { name: '판매 상품 등록', path: '/registration' },
            ]}
          />
        </S.HeaderNavBox>
        <S.HeaderMenuBox>
          <S.BuyerPageLink to={'/'}>구매자 페이지</S.BuyerPageLink>
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

export default HeaderContentForSeller;
