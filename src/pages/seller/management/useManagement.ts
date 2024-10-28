import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { fetchOrders } from '@/services/orderService';
import { getProductList } from '@/services/productService';
import { OrderStatus, ProductSchema } from '@/types/FirebaseType';
import { useQuery } from '@tanstack/react-query';
import { orderBy, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const useManagement = () => {
  const { userInfo } = useFirebaseAuth();
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<OrderStatus>(
    OrderStatus.All,
  );
  const [productList, setProductList] = useState<ProductSchema[]>([]);

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
    queryKey: ['orders'],
    queryFn: async () => {
      const filters = [where('sellerId', '==', userInfo!.uid)];
      return await fetchOrders({
        filters,
        sortOrders: [orderBy('createdAt', 'desc')],
      });
    },
  });

  return { selectedOrderStatus, productList, timeOrderData, timeOrderStatus };
};

export default useManagement;
