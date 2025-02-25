import Main from '@/components/layouts/main/Main';
import Header from '@/components/layouts/header/Header';
import * as S from './Signin.Style';
import useSignin from './useSignin';
import Spinner from '@/components/ui/spinner/Spinner';
import Input from '@/components/form/input/Input';
import signinImgUrlPng from '@/assets/images/signup.png';
import signinImgUrlWebp from '@/assets/images/signup.webp';
import HR from '@/components/ui/hr/HR';
import { useTheme } from 'styled-components';
import { FaFacebook, FaGithub, FaGoogle } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import {
  FacebookAuthProvider,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  TwitterAuthProvider,
} from 'firebase/auth';
import { auth } from '@/firebase';

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
  const theme = useTheme();

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
            <HR color={theme.color.border} />
            <h3>소셜 로그인</h3>
            <S.SigninIconBox>
              <FaGoogle
                onClick={() => {
                  const provider = new GoogleAuthProvider();
                  signInWithPopup(auth, provider)
                    .then((result) => {
                      // This gives you a Google Access Token. You can use it to access the Google API.
                      const credential =
                        GoogleAuthProvider.credentialFromResult(result);
                      console.dir(credential);
                      const token = credential!.accessToken;
                      // The signed-in user info.
                      const user = result.user;
                      // IdP data available using getAdditionalUserInfo(result)
                      // ...
                    })
                    .catch((error) => {
                      console.error(error);
                      // Handle Errors here.
                      const errorCode = error.code;
                      const errorMessage = error.message;
                      // The email of the user's account used.
                      const email = error.customData.email;
                      // The AuthCredential type that was used.
                      const credential =
                        GoogleAuthProvider.credentialFromError(error);
                      // ...
                    });
                }}
              />
              <FaXTwitter
                onClick={() => {
                  const provider = new TwitterAuthProvider();
                  signInWithPopup(auth, provider)
                    .then((result) => {
                      // This gives you a Google Access Token. You can use it to access the Google API.
                      const credential =
                        TwitterAuthProvider.credentialFromResult(result);
                      console.dir(credential);
                      const token = credential!.accessToken;
                      // The signed-in user info.
                      const user = result.user;
                      // IdP data available using getAdditionalUserInfo(result)
                      // ...
                    })
                    .catch((error) => {
                      console.error(error);
                      // Handle Errors here.
                      const errorCode = error.code;
                      const errorMessage = error.message;
                      // The email of the user's account used.
                      const email = error.customData.email;
                      // The AuthCredential type that was used.
                      const credential =
                        GoogleAuthProvider.credentialFromError(error);
                      // ...
                    });
                }}
              />
              <FaFacebook
                onClick={() => {
                  const provider = new FacebookAuthProvider();
                  signInWithPopup(auth, provider)
                    .then((result) => {
                      // This gives you a Google Access Token. You can use it to access the Google API.
                      const credential =
                        FacebookAuthProvider.credentialFromResult(result);
                      console.dir(credential);
                      const token = credential!.accessToken;
                      // The signed-in user info.
                      const user = result.user;
                      // IdP data available using getAdditionalUserInfo(result)
                      // ...
                    })
                    .catch((error) => {
                      console.error(error);
                      // Handle Errors here.
                      const errorCode = error.code;
                      const errorMessage = error.message;
                      // The email of the user's account used.
                      const email = error.customData.email;
                      // The AuthCredential type that was used.
                      const credential =
                        GoogleAuthProvider.credentialFromError(error);
                      // ...
                    });
                }}
              />
              <FaGithub
                onClick={() => {
                  const provider = new GithubAuthProvider();
                  signInWithPopup(auth, provider)
                    .then((result) => {
                      // This gives you a Google Access Token. You can use it to access the Google API.
                      const credential =
                        GithubAuthProvider.credentialFromResult(result);
                      console.dir(credential);
                      const token = credential!.accessToken;
                      // The signed-in user info.
                      const user = result.user;
                      // IdP data available using getAdditionalUserInfo(result)
                      // ...
                    })
                    .catch((error) => {
                      console.error(error);
                      // Handle Errors here.
                      const errorCode = error.code;
                      const errorMessage = error.message;
                      // The email of the user's account used.
                      const email = error.customData.email;
                      // The AuthCredential type that was used.
                      const credential =
                        GoogleAuthProvider.credentialFromError(error);
                      // ...
                    });
                }}
              />
            </S.SigninIconBox>
          </S.SigninFormContainer>
          <S.SigninPicture
            imageUrlMap={{
              original: signinImgUrlPng,
              webp: signinImgUrlWebp,
            }}
            size={700}
            alt='메인페이지이미지'
          />
        </S.SigninContainer>
      </Main>
    </>
  );
};

export default Signin;
