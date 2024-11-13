import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { fetchOrders } from '@/services/orderService';
import { getProductList } from '@/services/productService';
import { OrderStatus, ProductSchema } from '@/types/FirebaseType';
import { useQuery } from '@tanstack/react-query';
import { orderBy, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';

const useManagement = () => {
  const { userInfo } = useFirebaseAuth();
  const [productList, setProductList] = useState<ProductSchema[]>([]);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<OrderStatus>(
    OrderStatus.All,
  );
  const [selectedProduct, setSelectedProduct] = useState<ProductSchema>();

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

  /**
   * 화면 상단의 주문 현황을 위한 코드
   */
  const { data: timeOrderData, status: timeOrderStatus } = useQuery({
    queryKey: ['orders', 'seller', 'All'],
    queryFn: async () => {
      console.log('query called');
      const filters = [where('sellerId', '==', userInfo!.uid)];
      return await fetchOrders({
        filters,
        sortOrders: [orderBy('createdAt', 'desc')],
      });
    },
  });

  const filteredOrderData = useMemo(() => {
    let filteredOrderData = timeOrderData;
    if (filteredOrderData) {
      if (selectedOrderStatus !== OrderStatus.All)
        filteredOrderData = filteredOrderData.filter(
          (order) => order.orderStatus === selectedOrderStatus,
        );
      if (selectedProduct) {
        filteredOrderData = filteredOrderData.filter(
          (order) => order.orderData.id === selectedProduct.id,
        );
      }
    }
    return filteredOrderData;
  }, [selectedOrderStatus, selectedProduct, timeOrderData]);

  console.log(timeOrderData);

  return {
    selectedOrderStatus,
    setSelectedOrderStatus,
    productList,
    selectedProduct,
    setSelectedProduct,
    timeOrderStatus,
    filteredOrderData,
  };
};

export default useManagement;
