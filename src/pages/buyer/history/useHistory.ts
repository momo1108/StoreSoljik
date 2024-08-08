import { OrderStatus } from '@/types/FirebaseType';
import { useEffect, useRef, useState } from 'react';

const useHistory = () => {
  const orderStatus = useRef<OrderStatus | 'All'>('All');

  useEffect(() => {
    console.log('effect', orderStatus.current);
  }, [orderStatus.current]);

  // const { data, status, error, fetchNextPage, isFetchingNextPage, isLoading } =
  //   useInfiniteQuery<FetchInfiniteProductsResult>({
  //     queryKey,
  //     queryFn: (({ pageParam }) =>
  //       fetchProductsWrapper({ pageParam, filterOptions })) as QueryFunction<
  //       FetchInfiniteProductsResult,
  //       QueryKey,
  //       unknown
  //     >,
  //     initialPageParam: null,
  //     getNextPageParam: (lastPage) =>
  //       lastPage.documentArray.length > pageSize
  //         ? lastPage.documentArray[pageSize]
  //         : null,
  //   });

  return { orderStatus };
};

export default useHistory;
