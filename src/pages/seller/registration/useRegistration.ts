import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useEffect, useState } from 'react';
import { FirestoreError } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { StorageError } from 'firebase/storage';
import {
  createProductData,
  deleteProductDocument,
  deleteProductImages,
  uploadProductImage,
} from '@/services/productService';
import {
  createCategory,
  getAllCategories,
  updateCategory,
} from '@/services/categoryService';
import { toast } from 'sonner';
import { ProductFormData } from '@/types/FormType';
import { createProductRegisterObject } from '@/utils/createRegisterObject';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getKoreanIsoDatetime } from '@/utils/utils';
import { resizeImage } from '@/utils/imageUtils';

const useRegistration = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userInfo } = useFirebaseAuth();
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

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

      for (const file of watchImages) {
        newImages.push(URL.createObjectURL(file));
        const img = new Image();
        img.src = URL.createObjectURL(file);
        console.dir(img);
        resizeImage(file, 200);
      }

      setImagePreviewUrls(newImages);
    } else setImagePreviewUrls([]);
  }, [watchImages]);

  const registrateItemToDB = async (data: ProductFormData) => {
    const isoTime = getKoreanIsoDatetime();
    const id = `${userInfo!.uid}-${uuidv4()}`;

    try {
      /**
       * 1. Storage 로직
       */
      const productImageUrlArray: string[] = [];
      for (const imageFile of data.images) {
        const imageDownloadUrl = await uploadProductImage(
          `${id}/${imageFile.name}`,
          imageFile,
        );
        productImageUrlArray.push(imageDownloadUrl);
      }

      /**
       * 2. FireStore 로직
       */
      await createProductData({
        id,
        userInfo: userInfo!,
        formData: data,
        productImageUrlArray,
        isoTime,
      });

      /**
       * 3. 카테고리 컬렉션 정보 업데이트
       */
      const allCategories = await getAllCategories();
      if (!!allCategories.includes(data.productCategory)) {
        await updateCategory(data.productCategory, true);
      } else {
        await createCategory(data.productCategory);
      }

      // 완료 후 판매 상품 페이지로 이동
      toast.success('판매 상품 등록이 완료됐습니다!');
      navigate('/items');
    } catch (error: unknown) {
      if (error instanceof StorageError) {
        await deleteProductImages(id);
        const errorInstance = new Error(
          '제품 이미지 업로드에 실패했습니다. 잠시 후에 다시 시도해주세요.',
        );
        errorInstance.name = 'firebase.storage.image.registration';
        throw errorInstance;
      } else if (error instanceof FirestoreError) {
        await deleteProductImages(id);
        await deleteProductDocument(id);
        const errorInstance = new Error(
          '제품정보 저장에 실패했습니다. 잠시 후에 다시 시도해주세요.',
        );
        errorInstance.name = 'firebase.store.product.registration';
        throw errorInstance;
      }
    }
  };

  /**
   * 상품 업데이트 프로세스에서 상품 이미지 링크 정보들은 mutationFn 이 실행된 이후에 Firestore 에 업데이트가 완료되기 때문에
   * 따라서 mutationFn 이 실행되기 전에 onMutate 에서 Optimistic Update 을 실행하기에는 적절하지 않고, 모든 프로세스가 완료된 후에야
   * /items 페이지로 돌아가기 때문에 필요하지도 않다.
   */
  const registrateItem = useMutation({
    mutationFn: registrateItemToDB,
    onError: (err, productId) => {
      // 에러 발생 시 이전 데이터를 복원합니다.
      console.error(productId, err);
      toast.error(err.message);
    },
    onSettled: async () => {
      // 성공/실패와 관계없이 무효화하여 최신 데이터를 가져오게 합니다.
      await queryClient.invalidateQueries({ queryKey: ['products', 'seller'] });
      navigate('/items');
    },
  });

  /**
   * 1. 프로덕트의 id 를 받아와서 이미지를 Storage 에 저장할 때 경로로 활용.(저장 경로 : 판매상품id/image_번호_원본파일이름.확장자)
   * 2. 등록버튼 클릭 시 이미지 제외한 정보들 FireStore 의 product 컬렉션으로 저장.
   */
  const submitLogic: SubmitHandler<ProductFormData> = async (data) => {
    await registrateItem.mutateAsync(data);
  };

  const registerObject = createProductRegisterObject(register, 'registration');

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
