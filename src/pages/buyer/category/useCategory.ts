import { getValidCategories } from '@/services/categoryService';
import {
  fetchInfiniteProducts,
  FetchInfiniteProductsResult,
  ProductFilter,
} from '@/services/productService';
import {
  QueryFunction,
  QueryKey,
  useInfiniteQuery,
  // useQueryClient,
} from '@tanstack/react-query';
import { orderBy, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const useCategory = () => {
  const { state } = useLocation();
  const [validCategories, setValidcategories] = useState<string[]>([]);
  useEffect(() => {
    getValidCategories()
      .then((res) => {
        setValidcategories(res);
      })
      .catch((err) => {
        toast.error((err as Error).message);
        console.log(err);
      });
  }, [setValidcategories]);

  const [filterOptions, setFilterOptions] = useState<ProductFilter>({
    category: state?.category || '전체',
    field: 'createdAt',
    direction: 'desc',
  });

  // queryKey를 카테고리와 정렬 기준에 따라 동적으로 생성합니다.
  const queryKey = [
    'products',
    'buyer',
    filterOptions.category,
    filterOptions.field,
    filterOptions.direction,
  ];

  const [pageSize] = useState<number>(8);
  const fetchProductsWrapper = async ({
    pageParam,
    filterOptions,
  }: {
    pageParam: unknown;
    filterOptions: ProductFilter;
  }) => {
    try {
      return await fetchInfiniteProducts({
        pageParam,
        filters:
          filterOptions.category !== '전체'
            ? [where('productCategory', '==', filterOptions.category)]
            : [],
        sortOrders: (
          (filterOptions.field === 'createdAt'
            ? [[filterOptions.field, filterOptions.direction]]
            : [
                [filterOptions.field, filterOptions.direction],
                ['createdAt', 'desc'],
              ]) as [string, 'asc' | 'desc'][]
        ).map((order) => orderBy(...order)),
        pageSize: pageSize,
      });
    } catch (error) {
      toast.error(`데이터 로딩에 실패했습니다.\n${(error as Error).message}`);
      console.log(error);
    }
  };

  // 현재 카테고리와 정렬 기준에 따라 쿼리 결과를 미리 fetch합니다.
  // const queryClient = useQueryClient();
  // const fetchSelectedQuery = (newFilterOptions: ProductFilter) => {
  //   queryClient.prefetchQuery({
  //     queryKey: queryKey,
  //     queryFn: (({ pageParam }) =>
  //       fetchProductsWrapper({
  //         pageParam,
  //         filterOptions: newFilterOptions,
  //       })) as QueryFunction<FetchInfiniteProductsResult, string[], unknown>,
  //   });
  // };

  const { data, status, error, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<FetchInfiniteProductsResult>({
      queryKey,
      queryFn: (({ pageParam }) =>
        fetchProductsWrapper({ pageParam, filterOptions })) as QueryFunction<
        FetchInfiniteProductsResult,
        QueryKey,
        unknown
      >,
      initialPageParam: null,
      getNextPageParam: (lastPage) =>
        lastPage.documentArray.length > pageSize
          ? lastPage.documentArray[pageSize]
          : null,
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
    categories: validCategories,
    filterOptions,
    setFilterOptions,
    data,
    status,
    error,
    isFetchingNextPage,
    isLoading,
    ref,
    pageSize,
  };
};

export default useCategory;
