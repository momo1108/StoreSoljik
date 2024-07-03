import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  browserLocalPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/firebase';
import { FirebaseError } from 'firebase/app';
import { MouseEventHandler } from 'react';

type SigninFormDataType = {
  email: string;
  password: string;
  isMaintainChecked: boolean;
};

const useSignin = () => {
  const navigate = useNavigate();

  const redirectToSignup: MouseEventHandler<HTMLButtonElement> = () => {
    navigate('/signup');
  };

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SigninFormDataType>();

  const submitLogic: SubmitHandler<SigninFormDataType> = async (data) => {
    try {
      if (data.isMaintainChecked) {
        await auth.setPersistence(browserLocalPersistence);
      } else {
        await auth.setPersistence(browserSessionPersistence);
      }

      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (error.code == 'auth/invalid-credential') {
          alert('잘못된 ID 혹은 비밀번호입니다.');
        } else {
          alert(error);
        }
      } else {
        alert(error);
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

  return {
    redirectToSignup,
    handleSubmit,
    submitLogic,
    isSubmitting,
    errors,
    registerEmail,
    registerPassword,
    registerMaintainCheckbox,
  };
};

export default useSignin;
