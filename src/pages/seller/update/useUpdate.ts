import { SubmitHandler, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { ChangeEventHandler, useEffect, useState } from 'react';
import { FirestoreError, doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { StorageError } from 'firebase/storage';
import {
  deleteProductDocument,
  deleteProductImages,
  uploadProductImage,
} from '@/services/productService';
import { toast } from 'sonner';
import { ProductFormData } from '@/types/FormType';
import { ProductSchema } from '@/types/FirebaseType';

const useUpdate = () => {
  const navigate = useNavigate();
  const { userInfo } = useFirebaseAuth();

  /**
   * 판매 상품 목록에서 전달받은 데이터 저장.
   * 저장한 데이터로 초기 입력값을 설정(이미지 제외)
   */
  const { state }: { state: { data: ProductSchema } | null } = useLocation();
  useEffect(() => {
    if (state === null) {
      navigate('/items');
    }
  }, []);
  const originalProductData = state && state.data;
  const defaultValues = originalProductData && {
    productCategory: originalProductData.productCategory,
    productName: originalProductData.productName,
    productDescription: originalProductData.productDescription,
    productPrice: originalProductData.productPrice.toString(),
    productQuantity: originalProductData.productQuantity.toString(),
  };

  /**
   * 이미지 업데이트 여부를 체크할 체크박스 state 와 이벤트 핸들러
   * 원본 이미지 데이터를 불러와서 FileList 로 만드는 방법이 없어서 그냥 수정 여부를 체크하여 새로운 이미지들만 다시 업로드 하는것으로 결정
   */
  const [isUpdatingImage, setIsUpdatingImage] = useState<boolean>(false);
  const handleCheckboxUpdate: ChangeEventHandler<HTMLInputElement> = (e) => {
    setIsUpdatingImage(e.target.checked);
  };

  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
    resetField,
    setError,
  } = useForm<ProductFormData>({
    defaultValues: defaultValues ? defaultValues : {},
  });

  const watchImages: FileList = watch('images');

  /**
   * 등록된 파일이 바뀔 때마다 이미지 프리뷰를 위한 url 들을 업데이트하자.
   * 업데이트에서는 사진 업데이트 여부를 체크하는 분기 추가.
   */
  useEffect(() => {
    if (isUpdatingImage) {
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
    } else {
      /**
       * 수정을 안하거나 취소하면 image 의 FileList 는 초기화
       */
      setImagePreviewUrls(
        originalProductData ? originalProductData.productImageUrlArray : [],
      );
      resetField('images');
    }
  }, [watchImages, isUpdatingImage]);

  /**
   * 1. 등록버튼 클릭 시 변경된 정보들과 원본을 합쳐 FireStore 의 도큐먼트를 업데이트
   * 2. 이미지를 수정한 경우 원본 프로덕트의 id 로 Storage 의 이미지를 찾아내서 삭제하고, 새로운 이미지로 다시 업로드.
   */
  const submitLogic: SubmitHandler<ProductFormData> = async (data) => {
    /**
     * 이미지의 경우 required 를 설정해놓으면 업데이트 체크를 하지 않는 경우에도 검증과정에 걸린다.
     * 따라서 submit 로직에서 따로 업데이트 여부와 이미지 FileList 의 길이를 체크하여 직접 에러를 발생시키기로 변경했다.
     */
    if (isUpdatingImage && data.images.length === 0) {
      setError('images', {
        type: 'required',
        message: '이미지 등록은 필수입니다.',
      });
      return;
    }

    const timeOffset = new Date().getTimezoneOffset() * 60000;
    const isoTime = new Date(Date.now() - timeOffset).toISOString();

    try {
      /**
       * 1. Storage 로직
       */
      const productImageUrlArray: string[] =
        originalProductData!.productImageUrlArray;

      if (isUpdatingImage) {
        /**
         * 기존 이미지들을 삭제해준다.
         */
        await deleteProductImages(originalProductData!.id);
        productImageUrlArray.length = 0;

        for (const imageFile of data.images) {
          const imageDownloadUrl = await uploadProductImage(
            `${originalProductData!.id}/${imageFile.name}`,
            imageFile,
          );
          productImageUrlArray.push(imageDownloadUrl);
        }
      }
      /**
       * 2. FireStore 로직
       */
      const documentData: ProductSchema = {
        id: originalProductData!.id,
        sellerEmail: userInfo!.email,
        sellerNickname: userInfo!.nickname,
        productName: data.productName,
        productDescription: data.productDescription,
        productPrice: parseInt(data.productPrice),
        productQuantity: parseInt(data.productQuantity),
        productCategory: data.productCategory,
        productImageUrlArray,
        productSalesrate: originalProductData!.productSalesrate,
        createdAt: originalProductData!.createdAt,
        updatedAt: isoTime,
      };

      await setDoc(doc(db, 'product', originalProductData!.id), documentData);

      // 완료 후 판매 상품 페이지로 이동
      toast.success('판매 상품 등록이 완료됐습니다!');
      setTimeout(() => {
        navigate('/items');
      }, 1000);
    } catch (error: unknown) {
      if (error instanceof StorageError) {
        await deleteProductImages(originalProductData!.id);
        toast.error(
          '제품 이미지 업데이트 과정 중간에 에러가 발생했습니다. 원본 이미지 파일이 삭제된 상태이니 잠시 후에 반드시 다시 시도해주세요.',
        );
      } else if (error instanceof FirestoreError) {
        await deleteProductImages(originalProductData!.id);
        await deleteProductDocument(originalProductData!.id);
        toast.error(
          '제품정보 업데이트에 실패했습니다. 잠시 후에 다시 시도해주세요.',
        );
      }
    }
  };

  const registerObject = {
    /**
     * 이미지의 경우 required 를 설정해놓으면 업데이트 체크를 하지 않는 경우에도 검증과정에 걸린다.
     * 따라서 submit 로직에서 따로 업데이트 여부와 이미지 FileList 의 길이를 체크하여 직접 에러를 발생시키기로 변경했다.
     */
    productImages: register('images'),

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
      max: {
        value: 99999999,
        message: '최대 가격은 1억원 미만입니다.',
      },
    }),

    productQuantity: register('productQuantity', {
      required: '재고량은 필수 입력입니다.',
      min: {
        value: 0,
        message: '재고량은 0개부터 가능합니다.',
      },
      max: {
        value: 10000,
        message: '최대 재고량은 10000개 입니다.',
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
    isUpdatingImage,
    handleCheckboxUpdate,
  };
};

export default useUpdate;
