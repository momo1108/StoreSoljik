import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { fetchInfiniteOrders, fetchOrders } from '@/services/orderService';
import {
  KoreanOrderStatus,
  OrderSchema,
  OrderStatus,
} from '@/types/FirebaseType';
import { FetchInfiniteQueryResult } from '@/types/ReactQueryType';
import {
  QueryFunction,
  QueryKey,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import { orderBy, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { toast } from 'sonner';

const useHistory = () => {
  const { userInfo } = useFirebaseAuth();

  const {
    data: allOrderData,
    error: allOrderError,
    status: allOrderStatus,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      return await fetchOrders({
        filters: [where('buyerId', '==', userInfo!.uid)],
        sortOrders: [orderBy('createdAt', 'desc')],
      });
    },
  });

  const orderStatusCount = useMemo<Record<KoreanOrderStatus, number>>(() => {
    const koreanOrderStatusMap: Record<OrderStatus, KoreanOrderStatus> = {
      OrderCreated: '주문 생성',
      OrderCompleted: '주문 완료',
      AwaitingShipment: '발송 대기',
      ShipmentStarted: '발송 시작',
      OrderCancelled: '주문 취소',
    };
    const countMap: Record<KoreanOrderStatus, number> = {
      '주문 생성': 0,
      '주문 완료': 0,
      '발송 대기': 0,
      '발송 시작': 0,
      '주문 취소': 0,
    };

    if (allOrderData) {
      allOrderData.forEach((data) => {
        countMap[koreanOrderStatusMap[data.orderStatus]]++;
      });
    }

    return countMap;
  }, [allOrderData]);

  const [orderStatus, setOrderStatus] = useState<OrderStatus | 'All'>('All');

  // queryKey를 선택된 orderStatus 에 따라 동적으로 생성합니다.
  const queryKey = ['orders', orderStatus];

  const [pageSize] = useState<number>(8);
  const fetchOrdersWrapper = async ({ pageParam }: { pageParam: unknown }) => {
    try {
      return await fetchInfiniteOrders({
        pageParam,
        filters:
          orderStatus !== 'All'
            ? [
                where('orderStatus', '==', orderStatus),
                where('buyerId', '==', userInfo!.uid),
              ]
            : [where('buyerId', '==', userInfo!.uid)],
        sortOrders: [orderBy('createdAt', 'desc')],
        pageSize: pageSize,
      });
    } catch (error) {
      toast.error(`데이터 로딩에 실패했습니다.\n${(error as Error).message}`);
      console.log(error);
    }
  };

  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    isPending,
  } = useInfiniteQuery<FetchInfiniteQueryResult<OrderSchema>>({
    queryKey,
    queryFn: (({ pageParam }) =>
      fetchOrdersWrapper({ pageParam })) as QueryFunction<
      FetchInfiniteQueryResult<OrderSchema>,
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
    allOrderData,
    allOrderError,
    allOrderStatus,
    orderStatusCount,
    orderStatus,
    setOrderStatus,
    data,
    status,
    error,
    isFetchingNextPage,
    isLoading,
    isPending,
    ref,
    pageSize,
  };
};

export default useHistory;
