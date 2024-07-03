import * as S from './HeaderContentForBuyer.Style';
import HeaderLogoBox from '../../logo/HeaderLogoBox';
import Button from '@/components/ui/button/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const HeaderContentForBuyer: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

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
          <b>안녕하세요</b> 안녕하세요 헤더입니다.
        </S.HeaderNavBox>
        <S.HeaderMenuBox>
          <Button onClick={logout}>로그아웃</Button>
        </S.HeaderMenuBox>
      </S.HeaderTopBox>
    </>
  );
};

export default HeaderContentForBuyer;
