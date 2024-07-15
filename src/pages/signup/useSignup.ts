import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  User,
  createUserWithEmailAndPassword,
  deleteUser,
  updateProfile,
} from 'firebase/auth';
import { UserSchema, auth, db } from '@/firebase';
import { FirestoreError, doc, setDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { MouseEventHandler } from 'react';
import { toast } from 'sonner';

type SignupFormDataType = {
  email: string;
  password: string; // DB 에는 저장하지 않는 필드(인증은 Authentication 으로만 진행)
  accountType: '구매자' | '판매자';
  nickname: string;
};

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

  const submitLogic: SubmitHandler<SignupFormDataType> = async (data) => {
    try {
      const userCreateResult = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );

      const timeOffset = new Date().getTimezoneOffset() * 60000;
      const isoTime = new Date(Date.now() - timeOffset).toISOString();
      const documentData: UserSchema = {
        uid: userCreateResult.user.uid,
        email: data.email,
        accountType: data.accountType,
        nickname: data.nickname,
        createdAt: isoTime,
        updatedAt: isoTime,
      };

      await setDoc(doc(db, 'user', documentData.uid), documentData);

      await updateProfile(auth.currentUser as User, {
        displayName: `${data.nickname}#${data.accountType}`,
      });

      toast.success('회원 가입 완료');
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
          toast.error('이미 가입된 이메일입니다.');
        } else {
          toast.error(error.message);
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

  const registerAccountType = register('accountType', {
    required: '계정 종류 선택은 필수입니다.',
  });

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

  const registerNickname = register('nickname', {
    minLength: {
      value: 2,
      message: '닉네임은 2자 이상이어야 합니다.',
    },
    maxLength: {
      value: 10,
      message: '닉네임은 10자 이내여야 합니다.',
    },
    pattern: {
      value: /^[0-9a-zA-Z가-힣\x20]*$/,
      message: '한글/영어/숫자만 사용해주세요.',
    },
    required: '닉네임은 필수 입력입니다.',
  });

  const accountTypeOptions = [
    {
      value: '구매자',
      label: '구매자 계정',
    },
    {
      value: '판매자',
      label: '판매자 계정',
    },
  ];

  return {
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
  };
};

export default useSignup;
