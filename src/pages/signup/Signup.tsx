import { useForm, SubmitHandler } from 'react-hook-form';
import Main from '@/components/layouts/main/Main';
import Header from '@/components/layouts/header/Header';
import * as S from './Signup.Style';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';

interface IFormInput {
  email: string;
  password: string;
  isSeller: boolean;
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
      const result = await createUserWithEmailAndPassword(
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
        <S.SignupContainer>
          <S.SignupFormContainer onSubmit={handleSubmit(submitLogic)}>
            <h2>새로운 즐거움을 함께하세요!</h2>
            <p>
              BUYTHIS 는 언제나 새로운 고객님들을 환영합니다. <br />
              지금 가입하시고 최고의 상품들을 살펴보세요.
            </p>
            <S.SignupInputContainer>
              <S.SignupInput
                title='아이디(이메일)'
                inputType='email'
                placeholder='myemail@email.com'
                reactHookForm={register('email', {
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                })}
              />
              <S.SignupInput
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
                회원가입
              </S.SignButton>
              <S.SignButton
                styleType='normal'
                onClick={() => navigate('/signin')}
                disabled={isSubmitting}
              >
                로그인으로 돌아가기
              </S.SignButton>
              <hr />
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
