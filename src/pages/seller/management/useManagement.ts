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
      console.log(userInfo.uid);
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

  const orderDataPerDate = useMemo(() => {
    const tmpEntries: Record<string, OrderSchema[]> = {};

    if (timeOrderData && timeOrderData.pages[0].dataArray.length) {
      timeOrderData.pages.forEach((page) => {
        page.dataArray.forEach((orderData) => {
          const buyMonth = `${parseInt(getIsoDate(orderData.createdAt).split('-')[1])}월`;

          if (tmpEntries[buyMonth]) {
            tmpEntries[buyMonth].push(orderData);
          } else {
            tmpEntries[buyMonth] = [orderData];
          }
        });
      });
    }

    Object.values(tmpEntries).forEach((orderDataArray) =>
      orderDataArray.sort((o1, o2) => (o1.createdAt > o2.createdAt ? -1 : 1)),
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
          '판매자는 주문 취소가 불가능하고, 이미 주문 취소된 경우 변경이 불가합니다.',
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
            queryClient.invalidateQueries({ queryKey: ['orders'] });
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
