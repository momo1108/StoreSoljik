import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { auth } from '@/firebase';
import { FirestoreError } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { MouseEventHandler } from 'react';
import { toast } from 'sonner';
import { SignupFormDataType } from '@/types/FormType';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

const useSignup = () => {
  const navigate = useNavigate();

  const redirectToSignin: MouseEventHandler<HTMLButtonElement> = () => {
    navigate('/signin');
  };

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignupFormDataType>();

  const { authChannel } = useFirebaseAuth();

  const submitLogic: SubmitHandler<SignupFormDataType> = async (data) => {
    toast.promise(
      createUserWithEmailAndPassword(auth, data.email, data.password),
      {
        loading: '회원가입입 요청을 처리중입니다...',
        success: async (credential) => {
          authChannel!.postMessage({
            type: 'LOGIN',
            user: JSON.stringify(credential.user),
          });
          return '회원가입입이 완료됐습니다.';
        },
        error: async (error) => {
          console.error(error);
          if (error instanceof FirebaseError) {
            if (error.code === 'auth/email-already-in-use') {
              return '이미 가입된 이메일입니다.';
            } else {
              if (error instanceof FirebaseError && auth.currentUser) {
                await deleteUser(auth.currentUser);
              }
              return `회원가입에 실패했습니다. 다시 시도해주세요. [${error.message}]`;
            }
          } else if (error instanceof FirestoreError) {
            if (auth.currentUser) {
              await deleteUser(auth.currentUser);
              return '가입 정보 등록에 실패했습니다. 다시 회원가입을 시도해주세요.';
            }
          } else {
            return (error as Error).message;
          }
        },
      },
    );
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);

      toast.success('회원 가입 완료');
      navigate('/');
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
          toast.error('이미 가입된 이메일입니다.');
        } else {
          if (error instanceof FirebaseError && auth.currentUser) {
            await deleteUser(auth.currentUser);
          }
          toast.error('회원원가입에 실패했습니다. 다시 시도해주세요.', {
            description: error.message,
          });
        }
      } else if (error instanceof FirestoreError) {
        if (auth.currentUser) {
          await deleteUser(auth.currentUser);
          toast.error(
            '가입 정보 등록에 실패했습니다. 다시 회원가입을 시도해주세요.',
          );
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
    minLength: {
      value: 10,
      message: '패스워드는 10자 이상이어야 합니다.',
    },
    pattern: {
      value:
        /(((?=.*\d)(?=.*[a-z]))|((?=.*\d)(?=.*[A-Z]))|((?=.*\d)(?=.*[\W_]))|((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[\W_]))|((?=.*[A-Z])(?=.*[\W_]))).+/,
      message: '잘못된 규칙의 패스워드입니다.',
    },
    required: '패스워드는 필수 입력입니다.',
  });

  // const registerNickname = register('nickname', {
  //   minLength: {
  //     value: 2,
  //     message: '닉네임은 2자 이상이어야 합니다.',
  //   },
  //   maxLength: {
  //     value: 10,
  //     message: '닉네임은 10자 이내여야 합니다.',
  //   },
  //   pattern: {
  //     value: /^[0-9a-zA-Z가-힣\x20]*$/,
  //     message: '한글/영어/숫자만 사용해주세요.',
  //   },
  //   required: '닉네임은 필수 입력입니다.',
  // });

  return {
    redirectToSignin,
    handleSubmit,
    submitLogic,
    isSubmitting,
    errors,
    registerEmail,
    registerPassword,
  };
};

export default useSignup;
