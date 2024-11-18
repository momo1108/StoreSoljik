import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import {
  fetchInfiniteOrders,
  updateOrderStatus,
} from '@/services/orderService';
import { getProductList } from '@/services/productService';
import {
  koreanOrderStatusMap,
  OrderSchema,
  OrderStatus,
  orderStatusLevel,
  ProductSchema,
  QueryDocumentType,
} from '@/types/FirebaseType';
import { FetchInfiniteQueryResult } from '@/types/ReactQueryType';
import { getIsoDate } from '@/utils/utils';
import {
  QueryFunction,
  QueryKey,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { orderBy, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { toast } from 'sonner';

const useManagement = () => {
  const { userInfo } = useFirebaseAuth();
  const queryClient = useQueryClient();
  const [productList, setProductList] = useState<ProductSchema[]>([]);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<OrderStatus>(
    OrderStatus.All,
  );

  const [selectedProduct, setSelectedProduct] = useState<
    ProductSchema | undefined
  >(undefined);

  useEffect(() => {
    if (userInfo) {
      getProductList(userInfo.uid)
        .then((res) => {
          if (res) setProductList(res);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [userInfo]);

  const [pageSize] = useState<number>(8);

  const queryFn: QueryFunction<
    FetchInfiniteQueryResult<OrderSchema>,
    QueryKey,
    QueryDocumentType | null
  > = async ({ pageParam }) => {
    try {
      const filters = [where('sellerId', '==', userInfo!.uid)];
      if (selectedOrderStatus !== OrderStatus.All)
        filters.push(where('orderStatus', '==', selectedOrderStatus));
      if (selectedProduct)
        filters.push(where('orderData.id', '==', selectedProduct.id));

      return await fetchInfiniteOrders({
        pageParam,
        filters,
        sortOrders: [orderBy('createdAt', 'desc')],
        pageSize,
      });
    } catch (error) {
      toast.error(`데이터 로딩에 실패했습니다.\n${(error as Error).message}`);
      console.log(error);
      return { dataArray: [], documentArray: [] };
    }
  };
  /**
   * 화면 상단의 주문 현황을 위한 코드
   */
  const {
    data: timeOrderData,
    status: timeOrderStatus,
    refetch,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: selectedProduct
      ? ['orders', 'seller', selectedOrderStatus, selectedProduct.id]
      : ['orders', 'seller', selectedOrderStatus],
    queryFn,
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.documentArray.length > pageSize
        ? lastPage.documentArray[pageSize]
        : null,
  });

  useEffect(() => {
    // 주문 상태 변경 시 invalidateQueries 를 사용해도 현재 선택된 주문상태 query 가 아닌 다른 주문상태 query 의 데이터는 최신화되지 않음.
    // 전체 주문에서 특정 상품의 주문 상태를 발송 대기로 변경 후 발송 대기 상태로 이동하면 최신화되지 않아서 보이지 않는다.
    // 직접 refetch 를 호출하도록 설정했지만 그래도 바로 적용이 되지는 않는 것으로 확인
    if (timeOrderData) refetch();
  }, [selectedOrderStatus]);

  const orderDataPerDate = useMemo(() => {
    const tmpMap: Record<string, OrderSchema[]> = {};

    if (timeOrderData && timeOrderData.pages[0].dataArray.length) {
      timeOrderData.pages.forEach((page) => {
        page.dataArray.forEach((orderData) => {
          const buyMonth = `${parseInt(getIsoDate(orderData.createdAt).split('-')[1])}월`;

          if (tmpMap[buyMonth]) {
            tmpMap[buyMonth].push(orderData);
          } else {
            tmpMap[buyMonth] = [orderData];
          }
        });
      });
    }

    Object.values(tmpMap).forEach((orderDataArray) =>
      orderDataArray.sort((o1, o2) => (o1.createdAt > o2.createdAt ? -1 : 1)),
    );
    const tmpEntries: [string, OrderSchema[]][] = Object.entries(tmpMap).sort(
      (e1, e2) => (e1[0] > e2[0] ? -1 : 1),
    );

    return tmpEntries;
  }, [selectedOrderStatus, selectedProduct, timeOrderData]);

  const handleChangeOptionOrderStatus = (
    value: OrderStatus,
    order: OrderSchema,
  ) => {
    if (orderStatusLevel[value] <= orderStatusLevel[order.orderStatus]) {
      toast.warning('불가능한 변경입니다.', {
        description:
          '판매자는 주문을 취소하거나 이전 상태로 되돌릴 수 없습니다.',
      });
      return;
    }
    if (confirm(`'${koreanOrderStatusMap[value]}' 상태로 변경하시겠습니까?`)) {
      toast.promise(
        async () => {
          await updateOrderStatus({ order, orderStatus: value });
        },
        {
          loading: '주문 상태 변경 요청을 처리중입니다...',
          success: () => {
            queryClient.invalidateQueries({ queryKey: ['orders', 'seller'] });
            return `[${order.orderName}] 주문의 상태를 ${koreanOrderStatusMap[value]} 로 변경했습니다.`;
          },
          error: (error) => {
            console.log(error);
            return '주문 취소 요청이 실패하였습니다. 다시 시도해주세요.';
          },
        },
      );
    }
  };

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
    selectedOrderStatus,
    setSelectedOrderStatus,
    productList,
    selectedProduct,
    setSelectedProduct,
    timeOrderStatus,
    orderDataPerDate,
    handleChangeOptionOrderStatus,
    ref,
  };
};

export default useManagement;
