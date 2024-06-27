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
              <S.HeaderMenuBox></S.HeaderMenuBox>
            </S.HeaderTopBox>
            <S.HeaderNavBox>gd</S.HeaderNavBox>
          </>
        )}
      </S.HeaderInnerContainer>
    </S.Header>
  );
};

export default Header;
