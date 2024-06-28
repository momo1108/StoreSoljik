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
            <S.SigninInput title='아이디' />
            <S.SigninInput title='패스워드' />
            <S.SignButton type='primary'>로그인</S.SignButton>
            <S.SignButton type='primary'>회원가입</S.SignButton>
            <hr />
            <h3>소셜 로그인</h3>
            <S.SigninIconBox>gd</S.SigninIconBox>
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
