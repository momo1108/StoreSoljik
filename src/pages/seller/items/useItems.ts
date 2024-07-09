import { ProductSchema, db } from '@/firebase';
import { useAuth } from '@/hooks/useAuth';
import {
  deleteProductDocument,
  deleteProductImages,
} from '@/services/productService';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  collection,
  DocumentData,
  FirestoreError,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAt,
  where,
} from 'firebase/firestore';
import { StorageError } from 'firebase/storage';
import { MouseEventHandler, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

type PageParamType = QueryDocumentSnapshot<DocumentData, DocumentData>;

type FetchProductsResult = {
  documentArray: ProductSchema[];
  nextPage: PageParamType | null;
};

/**
 * useInfiniteQuery 사용 시 타입 에러가 나길래 unknown 으로 수정 후 fetch 함수 로직 내에서 number 로 지정하여 사용
 */
type queryFnProps = {
  pageParam: unknown;
};

type queryFnType = ({
  pageParam,
}: queryFnProps) => Promise<FetchProductsResult>;

const useItems = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const onClickRegistration: MouseEventHandler<HTMLButtonElement> = () =>
    navigate('/registration');
  const [pageSize] = useState<number>(10);

  const fetchProducts: queryFnType = async ({ pageParam }: queryFnProps) => {
    /**
     * 현재 인덱스부터 10개씩 짤라서 사용한다.
     * 단 추가된 마지막 1개는 다음 페이지가 있는지 체크하기 위한 용도로 사용한다.
     */
    let productsQuery = query(
      collection(db, 'product'),
      where('sellerEmail', '==', userInfo?.email),
      orderBy('createdAt', 'desc'),
      limit(pageSize + 1),
    );

    if (pageParam) {
      productsQuery = query(productsQuery, startAt(pageParam));
    }

    const productDocuments = await getDocs(productsQuery);
    const documentArray: ProductSchema[] = productDocuments.docs.map(
      (doc) => doc.data() as ProductSchema,
    );

    const nextPage =
      productDocuments.docs.length > 10 ? productDocuments.docs[10] : null;

    return {
      documentArray,
      nextPage,
    };
  };

  const { data, status, error, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<FetchProductsResult>({
      queryKey: ['product', 'seller'],
      queryFn: fetchProducts,
      initialPageParam: null,
      getNextPageParam: (lastPage) => lastPage.nextPage,
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

  const navigateToUpdate = async (data: ProductSchema) => {
    const copiedData = JSON.parse(JSON.stringify(data));
    navigate('/update', { state: { data: copiedData } });
  };

  const queryClient = useQueryClient();

  const deleteItemFromDB = async (id: string) => {
    try {
      await deleteProductImages(id);
      await deleteProductDocument(id);
    } catch (error: unknown) {
      if (error instanceof StorageError) {
        // https://firebase.google.com/docs/storage/web/handle-errors?hl=ko
        throw new Error(
          '제품 이미지 삭제에 실패했습니다. 잠시 후에 다시 시도해주세요.',
        );
      } else if (error instanceof FirestoreError) {
        throw new Error(
          '제품정보 삭제에 실패했습니다. 잠시 후에 다시 시도해주세요.',
        );
      } else {
        throw error as Error;
      }
    }
  };

  const deleteItem = useMutation({
    mutationFn: deleteItemFromDB,
    onMutate: async (itemId: string) => {
      await queryClient.cancelQueries({ queryKey: ['product', 'seller'] });

      const previousData = queryClient.getQueryData(['product', 'seller']);

      // Optimistic Update: 아이템을 미리 제거합니다.
      queryClient.setQueryData(
        ['product', 'seller'],
        (oldData: {
          pages: FetchProductsResult[];
          pageParams: PageParamType;
        }) => {
          return {
            ...oldData,
            pages: oldData.pages.map((page: FetchProductsResult) => ({
              ...page,
              items: page.documentArray.filter(
                (product) => product.id !== itemId,
              ),
            })),
          };
        },
      );

      return { previousData };
    },
    onError: (err, itemId, context) => {
      // 에러 발생 시 이전 데이터를 복원합니다.
      console.error(itemId, err);
      queryClient.setQueryData(['product', 'seller'], context!.previousData);
    },
    onSettled: () => {
      // 성공/실패와 관계없이 무효화하여 최신 데이터를 가져오게 합니다.
      queryClient.invalidateQueries({ queryKey: ['product', 'seller'] });
    },
  });

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
