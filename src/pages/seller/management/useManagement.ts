import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { fetchOrders } from '@/services/orderService';
import { useQuery } from '@tanstack/react-query';
import { orderBy, where } from 'firebase/firestore';

const useManagement = () => {
  const { userInfo } = useFirebaseAuth();

  /**
   * 화면 상단의 주문 현황을 위한 코드
   */
  const { data: timeOrderData, status: timeOrderStatus } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      return await fetchOrders({
        filters: [where('sellerId', '==', userInfo!.uid)],
        sortOrders: [orderBy('createdAt', 'desc')],
      });
    },
  });

  return { timeOrderData, timeOrderStatus };
};

export default useManagement;
