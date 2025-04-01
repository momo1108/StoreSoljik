import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { updateCategory } from '@/services/categoryService';
import { deleteProductImages } from '@/services/imageService';
import {
  deleteProductDocument,
  fetchInfiniteProducts,
} from '@/services/productService';
import { PageParamType, ProductSchema } from '@/types/FirebaseType';
import { FetchInfiniteQueryResult } from '@/types/ReactQueryType';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { FirestoreError, orderBy, where } from 'firebase/firestore';
import { StorageError } from 'firebase/storage';
import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const useItems = () => {
  const { userInfo } = useFirebaseAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // console.log(userInfo);

  const handleClickRegistration: MouseEventHandler<HTMLButtonElement> = () =>
    navigate('/registration');

  const [pageSize] = useState<number>(10);
  const queryFnWrapper: ({
    pageParam,
  }: {
    pageParam: unknown;
  }) => Promise<FetchInfiniteQueryResult<ProductSchema>> = ({ pageParam }) =>
    fetchInfiniteProducts({
      pageParam,
      filters: [where('sellerId', '==', userInfo?.uid)],
      sortOrders: [orderBy('createdAt', 'desc')],
      pageSize,
    });

  const { data, status, error, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<FetchInfiniteQueryResult<ProductSchema>>({
      queryKey: ['products', 'seller'],
      queryFn: queryFnWrapper,
      initialPageParam: null,
      getNextPageParam: (lastPage) =>
        lastPage.documentArray && lastPage.documentArray.length > pageSize
          ? lastPage.documentArray[pageSize]
          : null,
    });

  const registeredData: ProductSchema[] = useMemo(() => {
    const result: ProductSchema[] = [];

    if (data) {
      data.pages.forEach((page) => {
        result.push(...page.dataArray);
      });
    }

    return result;
  }, [data]);

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
      const copiedPreviousData = JSON.parse(JSON.stringify(previousData));

      // Optimistic Update: 아이템을 미리 제거합니다.
      queryClient.setQueryData(
        ['products', 'seller'],
        (oldData: {
          pages: FetchInfiniteQueryResult<ProductSchema>[];
          pageParams: PageParamType[];
        }) => {
          const flattenedDataArray = oldData.pages
            .map((page: FetchInfiniteQueryResult<ProductSchema>) =>
              page.dataArray.slice(0, pageSize),
            )
            .flat()
            .filter((product) => product.id !== productId);
          const flattenedDocumentArray = oldData.pages
            .map((page: FetchInfiniteQueryResult<ProductSchema>) =>
              page.documentArray.slice(0, pageSize),
            )
            .flat()
            .filter((product) => product.id !== productId);
          const totalLength = flattenedDataArray.length;

          const newData: {
            pages: FetchInfiniteQueryResult<ProductSchema>[];
            pageParams: PageParamType[];
          } = {
            pages: [
              {
                dataArray: flattenedDataArray.slice(0, pageSize + 1),
                documentArray: flattenedDocumentArray.slice(0, pageSize + 1),
              },
            ],
            pageParams: [null],
          };

          for (let i = 1; i <= Math.floor(totalLength / pageSize); i++) {
            newData.pages.push({
              dataArray: flattenedDataArray.slice(
                i * pageSize,
                (i + 1) * pageSize + 1,
              ),
              documentArray: flattenedDocumentArray.slice(0, pageSize + 1),
            });
            newData.pageParams.push(flattenedDocumentArray[i * pageSize]);
          }

          return newData;
        },
      );

      return { previousData: copiedPreviousData };
    },
    onError: (err, productId, context) => {
      // 에러 발생 시 이전 데이터를 복원합니다.
      console.error(productId, err);
      queryClient.setQueryData(['products', 'seller'], context!.previousData);
      if (err.name === 'firebase.store.product.delete') {
        toast.error(
          '상품 삭제 도중 에러가 발생했습니다. 제품 이미지가 삭제된 상태이니 반드시 다시 삭제를 진행해주세요.',
        );
      } else if (err.name === 'firebase.storage.image.delete') {
        toast.error(
          '상품 이미지 삭제 도중 에러가 발생했습니다. 제품 이미지의 일부가가 삭제된 상태이니 반드시 다시 삭제를 시도해주세요.',
        );
      }
    },
    onSuccess: () => {
      toast.success('상품 삭제를 완료했습니다.');
    },
    onSettled: () => {
      // 성공/실패와 관계없이 무효화하여 최신 데이터를 가져오게 합니다.
      queryClient.invalidateQueries({ queryKey: ['products', 'seller'] });
    },
  });

  const handleClickUpdate = useCallback(
    (product: ProductSchema) => {
      const copiedProduct = JSON.parse(JSON.stringify(product));
      navigate('/update', { state: { data: copiedProduct } });
    },
    [navigate],
  );

  const handleClickDelete = useCallback(
    (product: ProductSchema) => {
      if (confirm(`"${product.productName}" 상품을 삭제하시겠습니까?`))
        deleteItem.mutate({
          id: product.id,
          category: product.productCategory,
        });
    },
    [deleteItem],
  );

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
    handleClickRegistration,
    ref,
    registeredData,
    status,
    error,
    isFetchingNextPage,
    isLoading,
    handleClickUpdate,
    handleClickDelete,
  };
};

export default useItems;
