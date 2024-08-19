import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { fetchOrders, getOrderCount } from '@/services/orderService';
import { OrderStatus } from '@/types/FirebaseType';
import { useQuery } from '@tanstack/react-query';
import { orderBy, where } from 'firebase/firestore';
import { useState } from 'react';

const useHistory = () => {
  const orderStatus = useState<OrderStatus | 'All'>('All');
  const { userInfo } = useFirebaseAuth();
  console.log(userInfo?.uid);
  getOrderCount();

  const { data, error } = useQuery({
    queryKey: ['orders', 'All'],
    queryFn: async () => {
      return await fetchOrders({
        filters: [where('buyerId', '==', userInfo!.uid)],
        sortOrders: [orderBy('createdAt', 'desc')],
      });
    },
  });

  console.log(error);

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
