import { PurchaseFormData } from '@/types/FormType';
import { useCallback, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useCartItemsActions } from '@/hooks/useCartItems';
import { useFirebaseAuth, UserInfo } from '@/hooks/useFirebaseAuth';
import { toast } from 'sonner';
import { confirmPayment, processPayment } from '@/services/paymentService';
import {
  fetchProducts,
  purchaseProducts,
  rollbackBatchOrder,
} from '@/services/productService';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { orderBy, where } from 'firebase/firestore';
import { updateBatchOrderStatus } from '@/services/orderService';
import { OrderStatus } from '@/types/FirebaseType';
import { v4 as uuidv4 } from 'uuid';

const usePurchase = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
  } = useForm<PurchaseFormData>();
  const { getItemsRef, clearCart } = useCartItemsActions();
  const { userInfo } = useFirebaseAuth();
  const isReadyToCheckoutRef = useRef<boolean>(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const queryClient = useQueryClient();

  const submitLogic: SubmitHandler<PurchaseFormData> = async (data) => {
    if (!isReadyToCheckoutRef.current) {
      toast.warning(
        '구매 품목과 결제 금액을 확인하고 구매하기 버튼 위의 체크박스를 체크해주세요.',
      );
      return;
    }

    if (getItemsRef().current.length === 0) {
      toast.warning('장바구니에 등록된 상품이 없습니다.');
      return;
    }

    await refetchProductQuantityArray();

    let batchOrderId = '';

    try {
      batchOrderId = await purchaseProducts(
        getItemsRef().current,
        userInfo as UserInfo,
        `${getItemsRef().current[0].productName}${getItemsRef().current.length > 1 ? ` 외 ${getItemsRef().current.length - 1}건` : ''}`,
      );

      /**
       * Toss Payments 로직
       */
      const confirmData = await processPayment({
        totalPrice: getItemsRef().current.reduce(
          (prev, cur) => prev + cur.productPrice * cur.productQuantity,
          0,
        ),
        orderId: uuidv4(),
        items: getItemsRef().current,
        email: data.buyerEmail,
        name: data.buyerName,
        phoneNumber: data.buyerPhoneNumber,
      });

      const paymentResultData = await confirmPayment({ confirmData });
      await updateBatchOrderStatus({
        batchOrderId,
        orderStatus: OrderStatus.OrderCompleted,
      });
      await queryClient.invalidateQueries({ queryKey: ['orders', 'buyer'] });

      toast.success(
        `"${paymentResultData.orderName}" 주문 건의 결제액 "${paymentResultData.totalAmount.toLocaleString()}원" 결제가 성공적으로 완료됐습니다.`,
      );

      clearCart();

      if (state?.prevRoute)
        navigate(state?.prevRoute, { state: state?.prevState || null });
      else navigate('/');
    } catch (error: unknown) {
      const purchaseError = error as Error & { code: string };
      console.dir(purchaseError);
      if (batchOrderId) await rollbackBatchOrder({ batchOrderId });

      if (purchaseError.code === 'PAY_PROCESS_CANCELED') {
        toast.warning('구매 프로세스를 취소하셨습니다.');
      } else {
        toast.error('구매 도중 에러가 발생했습니다.', {
          description: purchaseError.message,
        });
      }
    }
  };

  const {
    data: productQuantityArray,
    status: productQuantityArrayStatus,
    refetch: refetchProductQuantityArray,
  } = useQuery({
    queryKey: ['products', 'quantity'],
    queryFn: async () => {
      const productData = await fetchProducts({
        filters: [
          where(
            'id',
            'in',
            getItemsRef().current.map((item) => item.id),
          ),
        ],
        sortOrders: [orderBy('createdAt', 'desc')],
      });

      return productData;
    },
    refetchOnMount: 'always',
  });

  const handleChangeCheckbox = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      isReadyToCheckoutRef.current = e.target.checked;
    },
    [],
  );

  return {
    register,
    errors,
    handleSubmit,
    submitLogic,
    setValue,
    isReadyToCheckoutRef,
    isSubmitting,
    productQuantityArray,
    productQuantityArrayStatus,
    handleChangeCheckbox,
  };
};

export default usePurchase;
