import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  browserLocalPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/firebase';
import { FirebaseError } from 'firebase/app';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

type RegistrationFormDataType = {
  images: FileList; // 실제 input
  productName: string;
  productDescription: string;
  productImages: string[]; // db 에 저장될 이미지 파일 이름들
  productCategory: string;
  productPrice: number;
  productQuantity: number;
};

const useRegistration = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
  } = useForm<RegistrationFormDataType>();

  const watchImages: FileList = watch('images');

  /**
   * 등록된 파일이 바뀔 때마다 이미지 프리뷰를 위한 url 들을 업데이트하자.
   */
  useEffect(() => {
    if (watchImages && watchImages[0]) {
      /**
       * FileList 타입은 배열이 아니고 File 의 IterableIterator 이기 때문에 map 사용 불가.
       * 대신 for of 를 사용하자.
       */
      const newImages: string[] = [];

      for (const file of watchImages) {
        newImages.push(URL.createObjectURL(file));
      }

      setImagePreviewUrls(newImages);
    } else setImagePreviewUrls([]);
  }, [watchImages]);

  /**
   * 1. 등록버튼 클릭 시 이미지 제외한 정보들 FireStore 의 product 컬렉션으로 저장.
   * 2. 프로덕트의 id 를 받아와서 이미지를 Cloud Store 에 저장할 때 경로로 활용.(저장 경로 : 판매상품id/image_번호_원본파일이름.확장자)
   */
  const submitLogic: SubmitHandler<RegistrationFormDataType> = async (data) => {
    console.log(data);
  };

  const registerObject = {
    productImages: register('images', {
      required: '이미지 등록은 필수입니다.',
    }),

    productCategory: register('productCategory', {
      required: '카테고리명은 필수 입력입니다.',
      maxLength: {
        value: 10,
        message: '카테고리명은 10자 이내여야 합니다.',
      },
    }),

    productName: register('productName', {
      required: '상품명은 필수 입력입니다.',
      maxLength: {
        value: 30,
        message: '상품명은 30자 이내여야 합니다.',
      },
    }),

    productDescription: register('productDescription', {
      required: '상품설명은 필수 입력입니다.',
      maxLength: {
        value: 300,
        message: '상품설명은 300자 이내여야 합니다.',
      },
    }),

    productPrice: register('productPrice', {
      required: '상품가격은 필수 입력입니다.',
      min: {
        value: 0,
        message: '최저 가격은 0원부터 가능합니다.',
      },
    }),

    productQuantity: register('productQuantity', {
      required: '재고량은 필수 입력입니다.',
      min: {
        value: 0,
        message: '재고량은 0개부터 가능합니다.',
      },
    }),
  };

  return {
    handleSubmit,
    submitLogic,
    isSubmitting,
    errors,
    registerObject,
    imagePreviewUrls,
  };
};

export default useRegistration;
