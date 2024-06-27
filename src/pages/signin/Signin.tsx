import Main from '@/components/layouts/main/Main';
import Header from '@/components/layouts/header/Header';
import * as S from './Signin.Style';

const Signup = () => {
  return (
    <>
      <Header isSigning={true}></Header>
      <Main>
        <S.SigninContainer>
          <S.SigninFormContainer>
            <h2>환영합니다!</h2>
            <p>
              지금 접속하시고 최고의 상품들을 찾아보세요!
              <br />
              다양한 상품들이 세일중입니다.
            </p>
          </S.SigninFormContainer>
          <S.SigninImageBox>
            <img src='/src/assets/images/signup.png' alt='' />
          </S.SigninImageBox>
        </S.SigninContainer>
      </Main>
    </>
  );
};

export default Signup;
