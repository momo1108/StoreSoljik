import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { fetchInfiniteOrders, fetchOrders } from '@/services/orderService';
import { rollbackSingleOrder } from '@/services/productService';
import {
  KoreanOrderStatus,
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
type OrderStatusCountMap = Record<KoreanOrderStatus | '전체', number>;
const koreanOrderStatusMap: Record<OrderStatus, KoreanOrderStatus> = {
  OrderCreated: '주문 생성',
  OrderCompleted: '주문 완료',
  AwaitingShipment: '발송 대기',
  ShipmentStarted: '발송 시작',
  OrderCancelled: '주문 취소',
};

const useManagement = () => {
  const { userInfo } = useFirebaseAuth();

  /**
   * 화면 상단의 주문 현황을 위한 코드
   */
  const { data: allOrderData, status: allOrderStatus } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      return await fetchOrders({
        filters: [where('sellerId', '==', userInfo!.uid)],
        sortOrders: [orderBy('createdAt', 'desc')],
      });
    },
  });

  return {};
};

export default useManagement;
