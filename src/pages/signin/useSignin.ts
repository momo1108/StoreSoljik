import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import { FirebaseError } from 'firebase/app';
import { MouseEventHandler } from 'react';
import { toast } from 'sonner';
import { SigninFormDataType } from '@/types/FormType';
import {
  signinWithThirdParty,
  ThirdPartyProvider,
} from '@/utils/firebaseUtils';

const useSignin = () => {
  const navigate = useNavigate();

  const redirectToSignup: MouseEventHandler<HTMLButtonElement> = () => {
    navigate('/signup');
  };

  const {
    register,
    handleSubmit,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm<SigninFormDataType>();

  const submitLogic: SubmitHandler<SigninFormDataType> = async (data) => {
    try {
      if (data.isMaintainChecked)
        localStorage.setItem('soljik_maintain_session', 'maintain');
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/invalid-credential') {
          toast.error('잘못된 ID 혹은 비밀번호입니다.');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error((error as Error).message);
      }
    }
  };

  const registerEmail = register('email', {
    required: '아이디는 필수 입력입니다.',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: '잘못된 이메일 형식입니다.',
    },
  });

  const registerPassword = register('password', {
    required: '패스워드는 필수 입력입니다.',
  });

  const registerMaintainCheckbox = register('isMaintainChecked');

  const handleClickThirdParty = (thirdParty: ThirdPartyProvider) => {
    if (getValues('isMaintainChecked'))
      localStorage.setItem('soljik_maintain_session', 'maintain');

    toast.promise(signinWithThirdParty(thirdParty), {
      loading: '로그인 요청을 처리중입니다...',
      success: () => {
        return '로그인이 완료됐습니다.';
      },
      error: (error) => {
        console.dir(error);
        if (error.code === 'auth/account-exists-with-different-credential') {
          return `이미 다른 로그인 방식으로 가입된 이메일(${error.customData.email})입니다. 같은 이메일을 사용중인 다른 방식으로 시도해주세요.`;
        }
        return `로그인이 실패하였습니다. 다시 시도해주세요. [${error.message}]`;
      },
    });
  };

  return {
    redirectToSignup,
    handleSubmit,
    submitLogic,
    isSubmitting,
    errors,
    registerEmail,
    registerPassword,
    registerMaintainCheckbox,
    handleClickThirdParty,
  };
};

export default useSignin;
