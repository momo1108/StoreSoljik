import Main from '@/components/layouts/main/Main';
import Header from '@/components/layouts/header/Header';
import * as S from './Signin.Style';
import useSignin from './useSignin';
import Spinner from '@/components/ui/spinner/Spinner';
import Input from '@/components/form/input/Input';
import signinImgUrl from '@/assets/images/signup.png';

const Signin: React.FC = () => {
  const {
    redirectToSignup,
    handleSubmit,
    submitLogic,
    isSubmitting,
    errors,
    registerEmail,
    registerPassword,
    registerMaintainCheckbox,
  } = useSignin();
  return (
    <>
      <Header userType={'guest'} />
      <Main>
        <S.SigninContainer>
          <S.SigninFormContainer
            noValidate
            onSubmit={handleSubmit(submitLogic)}
          >
            <h2>환영합니다!</h2>
            <p>
              지금 접속하시고 최고의 상품들을 찾아보세요!
              <br />
              다양한 상품들이 세일중입니다.
            </p>
            <div>
              <Input
                title='아이디(이메일)'
                type='email'
                placeholder='myemail@email.com'
                reactHookForm={registerEmail}
                aria-errormessage={errors.email && errors.email.message}
              />
            </div>

            <Input
              title='패스워드'
              type='password'
              autoComplete='off'
              reactHookForm={registerPassword}
              aria-errormessage={errors.password && errors.password.message}
            />

            <S.SigninCheckbox
              id='mcb'
              name='mcb'
              description='로그인 유지'
              reactHookForm={registerMaintainCheckbox}
            />

            {isSubmitting ? (
              <Spinner spinnerSize={20}>
                <p>로그인 중 입니다.</p>
              </Spinner>
            ) : (
              <></>
            )}

            <S.SignButton
              styleType='primary'
              type='submit'
              disabled={isSubmitting}
            >
              로그인
            </S.SignButton>
            <S.SignButton
              styleType='primary'
              onClick={redirectToSignup}
              disabled={isSubmitting}
            >
              회원가입
            </S.SignButton>
            <hr />
            <h3>소셜 로그인</h3>
            <S.SigninIconBox>gd</S.SigninIconBox>
          </S.SigninFormContainer>
          <S.SigninImageBox>
            <img src={signinImgUrl} alt='' />
          </S.SigninImageBox>
        </S.SigninContainer>
      </Main>
    </>
  );
};

export default Signin;
