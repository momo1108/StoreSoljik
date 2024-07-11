import * as S from './HeaderContentForBuyer.Style';
import HeaderLogoBox from '../../logo/HeaderLogoBox';
import Button from '@/components/ui/button/Button';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

const HeaderContentForBuyer: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useFirebaseAuth();

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
          <Button onClick={logout}>로그아웃</Button>
        </S.HeaderMenuBox>
      </S.HeaderTopBox>
    </>
  );
};

export default HeaderContentForBuyer;
