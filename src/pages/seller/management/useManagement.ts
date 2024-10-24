import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { fetchOrders } from '@/services/orderService';
import { OrderStatus } from '@/types/FirebaseType';
import { useQuery } from '@tanstack/react-query';
import { orderBy, where } from 'firebase/firestore';
import { useState } from 'react';

const useManagement = () => {
  const { userInfo } = useFirebaseAuth();
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<OrderStatus>(
    OrderStatus.All,
  );

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

  return { timeOrderData, timeOrderStatus };
};

export default useManagement;
