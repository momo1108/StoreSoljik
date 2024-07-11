import { ProductSchema } from '@/firebase';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { updateCategory } from '@/services/categoryService';
import {
  deleteProductDocument,
  deleteProductImages,
  fetchInfiniteProducts,
  FetchInfiniteProductsResult,
  PageParamType,
} from '@/services/productService';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { FirestoreError, orderBy, where } from 'firebase/firestore';
import { StorageError } from 'firebase/storage';
import { MouseEventHandler, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

const useItems = () => {
  const { userInfo } = useFirebaseAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onClickRegistration: MouseEventHandler<HTMLButtonElement> = () =>
    navigate('/registration');

  const navigateToUpdate = async (data: ProductSchema) => {
    const copiedData = JSON.parse(JSON.stringify(data));
    navigate('/update', { state: { data: copiedData } });
  };

  const queryFnWrapper: ({
    pageParam,
  }: {
    pageParam: unknown;
  }) => Promise<FetchInfiniteProductsResult> = ({ pageParam }) =>
    fetchInfiniteProducts({
      pageParam,
      filters: [where('sellerEmail', '==', userInfo?.email)],
      sortOrders: [orderBy('createdAt', 'desc')],
      pageSize: 10,
    });

  const { data, status, error, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<FetchInfiniteProductsResult>({
      queryKey: ['products', 'seller'],
      queryFn: queryFnWrapper,
      initialPageParam: null,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });

  const deleteItemFromDB = async ({
    id,
    category,
  }: {
    id: string;
    category: string;
  }) => {
    try {
      await deleteProductImages(id);
      await deleteProductDocument(id);
      await updateCategory(category, false);
    } catch (error: unknown) {
      if (error instanceof StorageError) {
        // https://firebase.google.com/docs/storage/web/handle-errors?hl=ko
        const errorInstance = new Error(
          '제품 이미지 삭제에 실패했습니다. 잠시 후에 다시 시도해주세요.',
        );
        errorInstance.name = 'firebase.storage.image.delete';
        throw errorInstance;
      } else if (error instanceof FirestoreError) {
        const errorInstance = new Error(
          '제품정보 삭제에 실패했습니다. 잠시 후에 다시 시도해주세요.',
        );
        errorInstance.name = 'firebase.store.product.delete';
        throw errorInstance;
      } else {
        throw error as Error;
      }
    }
  };

  const deleteItem = useMutation({
    mutationFn: deleteItemFromDB,
    onMutate: async ({ id: productId }) => {
      await queryClient.cancelQueries({ queryKey: ['products', 'seller'] });

      const previousData = queryClient.getQueryData(['products', 'seller']);

      // Optimistic Update: 아이템을 미리 제거합니다.
      queryClient.setQueryData(
        ['products', 'seller'],
        (oldData: {
          pages: FetchInfiniteProductsResult[];
          pageParams: PageParamType;
        }) => {
          return {
            ...oldData,
            pages: oldData.pages.map((page: FetchInfiniteProductsResult) => ({
              ...page,
              items: page.documentArray.filter(
                (product) => product.id !== productId,
              ),
            })),
          };
        },
      );

      alert('상품 삭제를 완료했습니다.');

      return { previousData };
    },
    onError: (err, productId, context) => {
      // 에러 발생 시 이전 데이터를 복원합니다.
      console.error(productId, err);
      queryClient.setQueryData(['products', 'seller'], context!.previousData);
      if (err.name === 'firebase.store.product.delete') {
        alert(
          '상품 삭제 도중 에러가 발생했습니다. 제품 이미지가 삭제된 상태이니 반드시 다시 삭제를 진행해주세요.',
        );
      } else if (err.name === 'firebase.storage.image.delete') {
        alert(
          '상품 이미지 삭제 도중 에러가 발생했습니다. 제품 이미지의 일부가가 삭제된 상태이니 반드시 다시 삭제를 시도해주세요.',
        );
      }
    },
    onSettled: () => {
      // 성공/실패와 관계없이 무효화하여 최신 데이터를 가져오게 합니다.
      queryClient.invalidateQueries({ queryKey: ['products', 'seller'] });
    },
  });

  const { ref, inView } = useInView({
    /* options */
    threshold: 0.5, // 요소가 화면에 50% 이상 보일 때 감지
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return {
    onClickRegistration,
    ref,
    data,
    status,
    error,
    isFetchingNextPage,
    isLoading,
    navigateToUpdate,
    deleteItem,
  };
};

export default useItems;
