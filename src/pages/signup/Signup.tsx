import Main from '@/components/layouts/main/Main';
import Header from '@/components/layouts/header/Header';
import * as S from './Signup.Style';
import VerticalRadio from '@/components/form/radio/VerticalRadio';
import useSignup from './useSignup';
import Spinner from '@/components/ui/spinner/Spinner';
import Input from '@/components/form/input/Input';
import HR from '@/components/ui/hr/HR';
import { useTheme } from 'styled-components';

const Signup: React.FC = () => {
  const {
    redirectToSignin,
    handleSubmit,
    submitLogic,
    isSubmitting,
    errors,
    registerAccountType,
    registerEmail,
    registerPassword,
    registerNickname,
    accountTypeOptions,
  } = useSignup();
  const theme = useTheme();

  return (
    <>
      <Header userType={'guest'}></Header>
      <Main>
        <S.SignupContainer>
          <S.SignupFormContainer
            noValidate
            onSubmit={handleSubmit(submitLogic)}
          >
            <h2>새로운 즐거움을 함께하세요!</h2>
            <p>
              BUYTHIS 는 언제나 새로운 고객님들을 환영합니다. <br />
              지금 가입하시고 최고의 상품들을 살펴보세요.
            </p>
            <S.SignupInputContainer>
              <VerticalRadio
                reactHookForm={registerAccountType}
                name='accountType'
                options={accountTypeOptions}
                aria-errormessage={
                  errors.accountType && errors.accountType.message
                }
              />
              <Input
                title='아이디(이메일)'
                type='email'
                placeholder='myemail@email.com'
                reactHookForm={registerEmail}
                aria-errormessage={errors.email && errors.email.message}
              />

              <Input
                title='패스워드'
                description='소문자/대문자/숫자/특수문자 중 2가지 이상을 사용합니다.'
                type='password'
                autoComplete='off'
                reactHookForm={registerPassword}
                aria-errormessage={errors.password && errors.password.message}
              />

              <Input
                title='닉네임(2~10글자)'
                description='닉네임은 한글/영어/숫자 입력만 가능합니다.'
                type='text'
                reactHookForm={registerNickname}
                aria-errormessage={errors.nickname && errors.nickname.message}
              />

              {isSubmitting ? (
                <Spinner spinnerSize={20}>
                  <p>회원가입 중 입니다.</p>
                </Spinner>
              ) : (
                <></>
              )}

              <S.SignButton
                styleType='primary'
                type='submit'
                disabled={isSubmitting}
              >
                회원가입
              </S.SignButton>
              <S.SignButton
                styleType='normal'
                onClick={redirectToSignin}
                disabled={isSubmitting}
              >
                로그인으로 돌아가기
              </S.SignButton>
              <HR color={theme.color.border} />
              <h3>소셜 로그인</h3>
              <S.SigninIconBox>gd</S.SigninIconBox>
            </S.SignupInputContainer>
          </S.SignupFormContainer>
        </S.SignupContainer>
      </Main>
    </>
  );
};

export default Signup;
