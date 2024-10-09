import { useEffect, useRef } from 'react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import {
  rollbackUnfinishedOrderData,
  getUnfinishedOrderData,
} from '@/services/orderService';
import { toast } from 'sonner';

const useRollbackUnfinishedTransactions = () => {
  const { userInfo } = useFirebaseAuth();
  const hasCheckedTransactions = useRef(false); // 현재 세션에서 주문 정보의 체크 여부를 나타내는 flag

  // 미결제 주문 삭제와 상품 수량 롤백은 모두 성공해야 의미가 있기 때문에, Firestore 의 트랜잭션 api로 작성됨
  useEffect(() => {
    if (
      userInfo &&
      userInfo.accountType === '구매자' &&
      !hasCheckedTransactions.current
    ) {
      getUnfinishedOrderData(userInfo.uid)
        .then(async (orderDocuments) => {
          if (orderDocuments.docs.length)
            rollbackUnfinishedOrderData(orderDocuments);
        })
        .catch((error) => {
          toast.error('사용자 계정의 구매 정보를 읽어오는데 실패했습니다.', {
            description: (error as Error).message,
          });
        });
    }
  }, [userInfo]);
};

export default useRollbackUnfinishedTransactions;
