import { SubmitHandler, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { ChangeEventHandler, useEffect, useState } from 'react';
import { FirestoreError } from 'firebase/firestore';
import { StorageError } from 'firebase/storage';
import { updateProductData } from '@/services/productService';
import { toast } from 'sonner';
import { ProductFormData } from '@/types/FormType';
import { ProductSchema } from '@/types/FirebaseType';
import { createProductRegisterObject } from '@/utils/createRegisterObject';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getKoreanIsoDatetime } from '@/utils/utils';
import { resizeImage } from '@/utils/imageUtils';
import {
  deleteProductImages,
  uploadProductImage,
} from '@/services/imageService';

const useUpdate = () => {
  const navigate = useNavigate();
  const { userInfo } = useFirebaseAuth();
  const queryClient = useQueryClient();

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
        originalProductData
          ? originalProductData.productImageUrlMapArray.map(
              (imageUrlMap) => imageUrlMap['250px'],
            )
          : [],
      );
      resetField('images');
    }
  }, [watchImages, isUpdatingImage]);

  const updateItemFromDB = async (data: ProductFormData) => {
    const isoTime = getKoreanIsoDatetime();

    try {
      /**
       * 1. Storage 로직
       */
      const productImageUrlMapArray: Record<string, string>[] =
        originalProductData!.productImageUrlMapArray;

      if (isUpdatingImage) {
        /**
         * 기존 이미지들을 삭제해준다.
         */
        await deleteProductImages(originalProductData!.id);
        productImageUrlMapArray.length = 0;

        for (let i = 0; i < data.images.length; i++) {
          // [원본, 250, 600] 순서. 사이즈가 충분치 크지않은 경우, 250이나 600 크기의 리사이즈가 없을 수 있음.
          const imageFilesMap = await resizeImage(data.images[i], i);
          const imageKeys = [
            'original',
            'original_webp',
            '250px',
            '250px_webp',
            '600px',
            '600px_webp',
          ];
          const linkPerImage: Record<string, string> = {};

          for (let resizeIndex = 0; resizeIndex < 6; resizeIndex++) {
            const file = imageFilesMap[imageKeys[resizeIndex]];
            const imageKey = imageKeys[resizeIndex];

            if (!file) {
              linkPerImage[imageKey] = '';
              continue;
            }

            const imageDownloadUrl = await uploadProductImage(
              `${originalProductData!.id}/${file.name}`,
              file,
            );

            linkPerImage[imageKey] = imageDownloadUrl;
          }

          productImageUrlMapArray.push(linkPerImage);
        }
      }

      /**
       * 2. FireStore 로직
       */
      await updateProductData({
        originalProductData: originalProductData!,
        userInfo: userInfo!,
        formData: data,
        productImageUrlMapArray,
        isoTime,
      });

      // 완료 후 판매 상품 페이지로 이동
      toast.success('판매 상품 수정이 완료됐습니다!');
    } catch (error: unknown) {
      if (error instanceof StorageError) {
        const errorInstance = new Error(
          '상품 이미지 수정 도중 에러가 발생했습니다. 제품 이미지가 손상된 상태일 수 있으니 확인 후 반드시 다시 수정을 시도해주세요.',
        );
        errorInstance.name = 'firebase.storage.image.update';
        throw errorInstance;
      } else if (error instanceof FirestoreError) {
        const errorInstance = new Error(
          '상품 이미지 업로드 후 제품정보 업데이트 중 에러가 발생했습니다. 확인 후 잠시 후에 반드시 다시 시도해주세요.',
        );
        errorInstance.name = 'firebase.store.product.update';
        throw errorInstance;
      }
    }
  };

  /**
   * 상품 업데이트 프로세스에서 상품 이미지 링크 정보들은 mutationFn 이 실행된 이후에 Firestore 에 업데이트가 완료되기 때문에
   * 따라서 mutationFn 이 실행되기 전에 onMutate 에서 Optimistic Update 을 실행하기에는 적절하지 않다.
   */
  const updateItem = useMutation({
    mutationFn: updateItemFromDB,
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

    await updateItem.mutateAsync(data);
  };

  const registerObject = createProductRegisterObject(register, 'update');

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
