import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { SigninFormData } from './Signin';
import {
  browserLocalPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/firebase';

const useSignin = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SigninFormData>();

  const submitLogic: SubmitHandler<SigninFormData> = async (data) => {
    console.log(data);
    try {
      if (data.isMaintainChecked) {
        await auth.setPersistence(browserLocalPersistence);
      } else {
        await auth.setPersistence(browserSessionPersistence);
      }

      await signInWithEmailAndPassword(auth, data.email, data.password);

      navigate('/');
    } catch (error) {
      console.log(error);
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
    navigate,
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
