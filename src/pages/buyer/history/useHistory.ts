import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { fetchInfiniteOrders, fetchOrders } from '@/services/orderService';
import { rollbackSingleOrder } from '@/services/productService';
import {
  KoreanOrderStatus,
  koreanOrderStatusMap,
  OrderSchema,
  OrderStatus,
} from '@/types/FirebaseType';
import { FetchInfiniteQueryResult } from '@/types/ReactQueryType';
import { getIsoDate, getIsoTime } from '@/utils/utils';
import {
  QueryFunction,
  QueryKey,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { orderBy, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { toast } from 'sonner';

type DateOrderDataEntries = Array<[string, Array<[string, OrderSchema[]]>]>;
type OrderStatusCountMap = Record<KoreanOrderStatus, number>;

const useHistory = () => {
  const { userInfo } = useFirebaseAuth();
  const queryClient = useQueryClient();

  /**
   * 화면 상단의 주문 현황을 위한 코드
   */
  const { data: allOrderData, status: allOrderStatus } = useQuery({
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
  const [orderStatusForList, setOrderStatusForList] = useState<OrderStatus>(
    OrderStatus.All,
  );

  const orderStatusMapKrToEn: Record<KoreanOrderStatus, OrderStatus> = {
    '주문 생성': OrderStatus.OrderCreated,
    '주문 완료': OrderStatus.OrderCompleted,
    '발송 대기': OrderStatus.AwaitingShipment,
    '발송 시작': OrderStatus.ShipmentStarted,
    '주문 취소': OrderStatus.OrderCancelled,
    전체: OrderStatus.All,
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
        pageSize,
      });
    } catch (error) {
      toast.error(`데이터 로딩에 실패했습니다.\n${(error as Error).message}`);
      console.log(error);
    }
  };

  const { data, status, fetchNextPage } = useInfiniteQuery<
    FetchInfiniteQueryResult<OrderSchema>
  >({
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

  const dateOrderDataEntries = useMemo<DateOrderDataEntries | undefined>(() => {
    if (data && data.pages[0].dataArray.length) {
      const tmpEntries: DateOrderDataEntries = [];

      data.pages.forEach((page) => {
        page.dataArray.forEach((orderData) => {
          const buyDate = getIsoDate(orderData.createdAt);
          const buyTime = getIsoTime(orderData.createdAt, true);

          if (tmpEntries.length) {
            const lastDateIndex = tmpEntries.length - 1;
            if (tmpEntries[lastDateIndex][0] != buyDate)
              tmpEntries.push([buyDate, [[buyTime, [orderData]]]]);
            else {
              const lastTimeIndex = tmpEntries[lastDateIndex][1].length - 1;
              if (tmpEntries[lastDateIndex][1][lastTimeIndex][0] != buyTime)
                tmpEntries[lastDateIndex][1].push([buyTime, [orderData]]);
              else
                tmpEntries[lastDateIndex][1][lastTimeIndex][1].push(orderData);
            }
          } else {
            tmpEntries.push([buyDate, [[buyTime, [orderData]]]]);
          }
        });
      });
      console.log(tmpEntries);
      return tmpEntries;
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
    if (!confirm(`[${order.orderData.productName}] 주문을 취소하시겠습니까?`))
      return;

    setIsCancelingOrder(true);
    toast.promise(
      async () => {
        await rollbackSingleOrder(order);
      },
      {
        loading: '주문 취소 요청을 처리중입니다...',
        success: () => {
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          return `[${order.orderName}] 주문이 취소됐습니다.`;
        },
        error: (error) => {
          console.log(error);
          return '주문 취소 요청이 실패하였습니다. 다시 시도해주세요.';
        },
        finally: () => {
          setIsCancelingOrder(false);
        },
      },
    );
  };

  return {
    allOrderStatus,
    dateOrderDataEntries,
    orderStatusCountMap,
    orderStatusForList,
    setOrderStatusForList,
    orderStatusMapKrToEn,
    status,
    ref,
    isCancelingOrder,
    cancelOrder,
  };
};

export default useHistory;
