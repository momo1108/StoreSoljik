import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { SignupFormData } from './Signup';
import {
  User,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { UserSchema, auth, db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

const useSignup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignupFormData>();
  const submitLogic: SubmitHandler<SignupFormData> = async (data) => {
    try {
      const userCreateResult = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );

      await updateProfile(auth.currentUser as User, {
        displayName: `${data.nickname}#${data.accountType}`,
      });

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

      navigate('/signin');
    } catch (error) {
      console.log(error);
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
    navigate,
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
