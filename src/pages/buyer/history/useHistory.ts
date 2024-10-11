import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import {
  fetchInfiniteOrders,
  fetchOrders,
  updateOrderStatus,
} from '@/services/orderService';
import { rollbackBatchOrder } from '@/services/productService';
import {
  KoreanOrderStatus,
  OrderSchema,
  OrderStatus,
} from '@/types/FirebaseType';
import { FetchInfiniteQueryResult } from '@/types/ReactQueryType';
import { getIsoDate } from '@/utils/utils';
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

type BatchOrderDataMap = Record<string, OrderSchema[]>;
type OrderStatusCountMap = Record<KoreanOrderStatus | '전체', number>;
const koreanOrderStatusMap: Record<OrderStatus, KoreanOrderStatus> = {
  OrderCreated: '주문 생성',
  OrderCompleted: '주문 완료',
  AwaitingShipment: '발송 대기',
  ShipmentStarted: '발송 시작',
  OrderCancelled: '주문 취소',
};

const useHistory = () => {
  const { userInfo } = useFirebaseAuth();
  const [selectedBatchOrder, setSelectedBatchOrder] = useState<
    OrderSchema[] | undefined
  >(undefined);

  const getGroupedOrderTotalPrice = (orderArray: OrderSchema[]) =>
    orderArray.reduce(
      (prev, cur) =>
        prev + cur.orderData.productPrice * cur.orderData.productQuantity,
      0,
    );

  /**
   * 화면 상단의 주문 현황을 위한 코드
   */
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

  const orderStatusCountMap = useMemo<OrderStatusCountMap>(() => {
    const orderStatusCountMap: OrderStatusCountMap = {
      '주문 생성': 0,
      '주문 완료': 0,
      '발송 대기': 0,
      '발송 시작': 0,
      '주문 취소': 0,
      전체: 0,
    };

    if (allOrderData) {
      allOrderData.forEach((orderData) => {
        // 주문 상태를 key, key 에 해당하는 주문 건수를 value 로 매핑합니다.
        orderStatusCountMap[koreanOrderStatusMap[orderData.orderStatus]]++;
        if (orderData.orderStatus !== OrderStatus.OrderCreated)
          orderStatusCountMap['전체']++; // 혹시라도 rollback 되지 않은 결제 미완료주문을 제외합니다.
      });
    }

    return orderStatusCountMap;
  }, [allOrderData]);

  /**
   * 구매 내역 목록 관련 코드
   */
  const [orderStatusForList, setOrderStatusForList] = useState<
    OrderStatus | 'All'
  >('All');

  const orderStatusMapKrToEn: Record<
    KoreanOrderStatus | '전체',
    OrderStatus | 'All'
  > = {
    '주문 생성': OrderStatus.OrderCreated,
    '주문 완료': OrderStatus.OrderCompleted,
    '발송 대기': OrderStatus.AwaitingShipment,
    '발송 시작': OrderStatus.ShipmentStarted,
    '주문 취소': OrderStatus.OrderCancelled,
    전체: 'All',
  };

  const orderStatusMapEnToKr: Record<
    OrderStatus | 'All',
    KoreanOrderStatus | '전체'
  > = {
    [OrderStatus.OrderCreated]: '주문 생성',
    [OrderStatus.OrderCompleted]: '주문 완료',
    [OrderStatus.AwaitingShipment]: '발송 대기',
    [OrderStatus.ShipmentStarted]: '발송 시작',
    [OrderStatus.OrderCancelled]: '주문 취소',
    All: '전체',
  };

  // queryKey를 선택된 orderStatus 에 따라 동적으로 생성합니다.
  const queryKey = ['orders', orderStatusForList];

  const [pageSize] = useState<number>(8);
  const fetchOrdersWrapper = async ({ pageParam }: { pageParam: unknown }) => {
    try {
      return await fetchInfiniteOrders({
        pageParam,
        filters:
          orderStatusForList !== 'All'
            ? [
                where('orderStatus', '==', orderStatusForList),
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

  const batchOrderDataMap = useMemo<BatchOrderDataMap | undefined>(() => {
    if (data) {
      const batchOrderDataMap: BatchOrderDataMap = {};
      data.pages.forEach((page) => {
        page.dataArray.forEach((orderData) => {
          const buyDate = getIsoDate(orderData.createdAt);

          // 주문의 createdAt 필드를 key, 같은 batch 에 해당하는 주문 레코드들을 배열 형태로 value 로 사용해 그룹핑합니다.
          if (batchOrderDataMap[buyDate])
            batchOrderDataMap[buyDate].push(orderData);
          else batchOrderDataMap[buyDate] = [orderData];
        });
      });
      return batchOrderDataMap;
    }
    return undefined;
  }, [data]);

  const { ref, inView } = useInView({
    /* options */
    threshold: 0.5, // 요소가 화면에 50% 이상 보일 때 감지
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  /**
   * 주문 취소 관련 코드
   */
  const [isCancelingOrder, setIsCancelingOrder] = useState<boolean>(false);
  const cancelOrder = async (order: OrderSchema) => {
    if (!confirm(`[${order.orderName}] 주문을 취소하시겠습니까?`)) return;

    setIsCancelingOrder(true);
    toast.promise(
      async () => {
        await updateOrderStatus({
          orderId: order.batchOrderId,
          orderStatus: OrderStatus.OrderCancelled,
        });
        await rollbackBatchOrder({
          batchOrderId: order.batchOrderId,
          shouldDelete: false,
        });
      },
      {
        loading: '주문 취소 요청을 처리중입니다...',
        success: () => {
          return `[${order.orderName}] 주문이 취소됐습니다.`;
        },
        error: '주문 취소 요청이 실패하였습니다. 다시 시도해주세요.',
        finally: () => {
          setIsCancelingOrder(false);
        },
      },
    );
  };

  return {
    selectedBatchOrder,
    setSelectedBatchOrder,
    getGroupedOrderTotalPrice,
    allOrderData,
    allOrderError,
    allOrderStatus,
    batchOrderDataMap,
    orderStatusCountMap,
    orderStatusForList,
    setOrderStatusForList,
    orderStatusMapKrToEn,
    orderStatusMapEnToKr,
    data,
    status,
    error,
    isFetchingNextPage,
    isLoading,
    isPending,
    ref,
    pageSize,
    isCancelingOrder,
    cancelOrder,
  };
};

export default useHistory;
