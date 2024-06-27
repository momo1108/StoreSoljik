import Button from '@/components/ui/button/Button';
import * as S from './Header.Style';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

type HeaderProps = {
  /**
   * 회원가입/로그인 관련 페이지가 맞으면 true 아니면 false
   */
  isSigning?: boolean;
  /**
   * 로그인 된 상태이면 true 아니면 false
   */
  isSignedIn?: boolean;
};

const Header: React.FC<HeaderProps> = ({
  isSigning = false,
  isSignedIn = false,
}) => {
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    if (isSignedIn) {
      signOut(auth);
    } else {
      navigate('/signin');
    }
  }, [isSignedIn, navigate, signOut, auth]);

  return (
    <S.StyledHeader>
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
                <Button onClick={handleClick}></Button>
              </S.HeaderMenuBox>
            </S.HeaderTopBox>
            <S.HeaderNavBox>
              <b>안녕하세요</b> 안녕하세요 헤더입니다.
            </S.HeaderNavBox>
          </>
        )}
      </S.HeaderInnerContainer>
    </S.StyledHeader>
  );
};

export default Header;
