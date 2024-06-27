import Button from '@/components/ui/button/Button';
import * as S from './Header.Style';

type HeaderProps = {
  isSigning: boolean;
};

const Header: React.FC<HeaderProps> = ({ isSigning }) => {
  return (
    <S.Header>
      <S.HeaderInnerContainer>
        {isSigning ? (
          <S.HeaderTopBoxForSigning>
            <S.HeaderLogoBox
              $src={'src/assets/images/logo_original.png'}
            ></S.HeaderLogoBox>
          </S.HeaderTopBoxForSigning>
        ) : (
          <>
            <S.HeaderTopBox>
              <S.HeaderLogoBox
                $src={'src/assets/images/logo_original.png'}
              ></S.HeaderLogoBox>
              <S.HeaderSearchBox></S.HeaderSearchBox>
              <S.HeaderMenuBox>
                <Button></Button>
              </S.HeaderMenuBox>
            </S.HeaderTopBox>
            <S.HeaderNavBox>
              <b>안녕하세요</b> 안녕하세요 헤더입니다.
            </S.HeaderNavBox>
          </>
        )}
      </S.HeaderInnerContainer>
    </S.Header>
  );
};

export default Header;
