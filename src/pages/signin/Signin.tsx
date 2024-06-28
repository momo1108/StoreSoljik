import { useForm, SubmitHandler } from 'react-hook-form';
import Main from '@/components/layouts/main/Main';
import Header from '@/components/layouts/header/Header';
import * as S from './Signin.Style';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';

interface IFormInput {
  email: string;
  password: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<IFormInput>();
  const submitLogic: SubmitHandler<IFormInput> = async (data) => {
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header isSigning={true}></Header>
      <Main>
        <S.SigninContainer>
          <S.SigninFormContainer onSubmit={handleSubmit(submitLogic)}>
            <h2>환영합니다!</h2>
            <p>
              지금 접속하시고 최고의 상품들을 찾아보세요!
              <br />
              다양한 상품들이 세일중입니다.
            </p>
            <S.SigninInput
              title='아이디(이메일)'
              inputType='email'
              placeholder='myemail@email.com'
              reactHookForm={register('email', {
                required: true,
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              })}
            />
            <S.SigninInput
              title='패스워드'
              description='소문자/대문자/숫자/특수문자 중 2가지 이상을 사용합니다.'
              inputType='password'
              autoComplete='off'
              reactHookForm={register('password', {
                minLength: 10,
                pattern:
                  /(((?=.*\d)(?=.*[a-z]))|((?=.*\d)(?=.*[A-Z]))|((?=.*\d)(?=.*[\W_]))|((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[\W_]))|((?=.*[A-Z])(?=.*[\W_]))).+/,
                required: true,
              })}
            />
            <S.SignButton
              styleType='primary'
              type='submit'
              disabled={isSubmitting}
            >
              로그인
            </S.SignButton>
            <S.SignButton
              styleType='primary'
              onClick={() => navigate('/signup')}
              disabled={isSubmitting}
            >
              회원가입
            </S.SignButton>
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
