import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useRef, useState } from 'react';
import { FirestoreError, doc, setDoc } from 'firebase/firestore';
import { ProductFormData, ProductSchema, db, storage } from '@/firebase';
import { v4 as uuidv4 } from 'uuid';
import { StorageError, ref, uploadBytes } from 'firebase/storage';
import { deleteProduct } from '@/services/productService';

const useRegistration = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const productImageNamesArray = useRef<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
  } = useForm<ProductFormData>();

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
      productImageNamesArray.current = [];

      for (const file of watchImages) {
        newImages.push(URL.createObjectURL(file));
        productImageNamesArray.current.push(file.name);
      }

      setImagePreviewUrls(newImages);
    } else setImagePreviewUrls([]);
  }, [watchImages]);

  /**
   * 1. 등록버튼 클릭 시 이미지 제외한 정보들 FireStore 의 product 컬렉션으로 저장.
   * 2. 프로덕트의 id 를 받아와서 이미지를 Storage 에 저장할 때 경로로 활용.(저장 경로 : 판매상품id/image_번호_원본파일이름.확장자)
   */
  const submitLogic: SubmitHandler<ProductFormData> = async (data) => {
    const timeOffset = new Date().getTimezoneOffset() * 60000;
    const isoTime = new Date(Date.now() - timeOffset).toISOString();
    const id = `${userInfo!.uid}-${uuidv4()}`;

    try {
      /**
       * 1. FireStore 로직
       */
      const documentData: ProductSchema = {
        id,
        sellerEmail: userInfo!.email,
        sellerNickname: userInfo!.nickname,
        productName: data.productName,
        productDescription: data.productDescription,
        productPrice: data.productPrice,
        productQuantity: data.productQuantity,
        productCategory: data.productCategory,
        productImageNamesString: productImageNamesArray.current.join('**'),
        createdAt: isoTime,
        updatedAt: isoTime,
      };

      await setDoc(doc(db, 'product', id), documentData);

      /**
       * 2. Storage 로직
       */
      for (const imageFile of data.images) {
        const imageRef = ref(storage, `${id}/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
      }

      // 완료 후 판매 상품 페이지로 이동
      alert('판매 상품 등록이 완료됐습니다!');
      navigate('/items');
    } catch (error: unknown) {
      if (error instanceof FirestoreError) {
        alert('제품정보 저장에 실패했습니다. 잠시 후에 다시 시도해주세요.');
      } else if (error instanceof StorageError) {
        await deleteProduct(id);

        alert(
          '제품 이미지 업로드에 실패했습니다. 잠시 후에 다시 시도해주세요.',
        );
      }
    }
  };

  const registerObject = {
    productImages: register('images', {
      required: '이미지 등록은 필수입니다.',
    }),

    productCategory: register('productCategory', {
      required: '카테고리명은 필수 입력입니다.',
      onBlur: (event) => {
        event.target.value = event.target.value.trim();
      },
      validate: (value: string) =>
        !!value.trim() || '공백이 아닌 내용을 입력해주세요.',
      maxLength: {
        value: 10,
        message: '카테고리명은 10자 이내여야 합니다.',
      },
    }),

    productName: register('productName', {
      required: '상품명은 필수 입력입니다.',
      onBlur: (event) => {
        event.target.value = event.target.value.trim();
      },
      validate: (value: string) =>
        !!value.trim() || '공백이 아닌 내용을 입력해주세요.',
      maxLength: {
        value: 30,
        message: '상품명은 30자 이내여야 합니다.',
      },
    }),

    productDescription: register('productDescription', {
      required: '상품설명은 필수 입력입니다.',
      onBlur: (event) => {
        event.target.value = event.target.value.trim();
      },
      validate: (value: string) =>
        !!value.trim() || '공백이 아닌 내용을 입력해주세요.',
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
