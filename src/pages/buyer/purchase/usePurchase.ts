import usePostcode from '@/hooks/usePostcode';
import { DaumPostcodeResult } from '@/types/DaumPostcodeType';
import { PurchaseFormData } from '@/types/FormType';
import { ChangeEventHandler, MouseEventHandler, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useCartItems } from '@/hooks/useCartItems';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { toast } from 'sonner';
import { confirmPayment, processPayment } from '@/services/paymentService';
import { createPurchaseRegisterObject } from '@/utils/createRegisterObject';
import {
  fetchProducts,
  purchaseProducts,
  rollbackPurchaseProducts,
} from '@/services/productService';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { orderBy, where } from 'firebase/firestore';
import { updateOrderStatus } from '@/services/orderService';
import { OrderStatus } from '@/types/FirebaseType';

const usePurchase = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
  } = useForm<PurchaseFormData>();
  const { openPostcodeSearch } = usePostcode();
  const { totalPrice, items, clearCart } = useCartItems();
  const { userInfo } = useFirebaseAuth();
  const [isReadyToCheckout, setIsReadyToCheckout] = useState<boolean>(false);
  const navigate = useNavigate();
  const { state } = useLocation();

  const handlePurchaseCheckbox: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setIsReadyToCheckout(event.target.checked);
  };

  const submitLogic: SubmitHandler<PurchaseFormData> = async (data) => {
    if (!isReadyToCheckout) {
      toast.warning(
        '구매 품목과 결제 금액을 확인하고 구매하기 버튼 위의 체크박스를 체크해주세요.',
      );
      return;
    }

    refetchProductQuantityArray();

    let orderId: string = '';

    try {
      orderId = await purchaseProducts(
        items,
        userInfo!.uid,
        `${items[0].productName}${items.length > 1 ? ` 외 ${items.length - 1}건` : ''}`,
      );

      /**
       * Toss Payments 로직
       */
      const confirmData = await processPayment({
        totalPrice,
        orderId,
        items,
        email: data.buyerEmail,
        name: data.buyerName,
        phoneNumber: data.buyerPhoneNumber,
      });

      const paymentResultData = await confirmPayment({ confirmData });
      await updateOrderStatus({
        orderId,
        orderStatus: OrderStatus.OrderCompleted,
      });

      toast.success(
        `"${paymentResultData.orderName}" 주문 건의 결제액 "${paymentResultData.totalAmount.toLocaleString()}원" 결제가 성공적으로 완료됐습니다.`,
      );

      clearCart();

      if (state?.prevRoute)
        navigate(state?.prevRoute, { state: state?.prevState || null });
      else navigate('/');
    } catch (error: unknown) {
      console.log(error);
      if (orderId) await rollbackPurchaseProducts(items, orderId);
      toast.error('구매 도중 에러가 발생했습니다.', {
        description: (error as Error).message,
      });
    }
  };

  const setPostcodeAddress = (data: DaumPostcodeResult) => {
    // 각 주소의 노출 규칙에 따라 주소를 조합한다.
    // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
    let addr = ''; // 주소 변수
    let extraAddr = ''; // 참고항목 변수

    //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
    if (data.userSelectedType === 'R') {
      // 사용자가 도로명 주소를 선택했을 경우
      addr = data.roadAddress;
    } else {
      // 사용자가 지번 주소를 선택했을 경우(J)
      addr = data.jibunAddress;
    }

    if (data.userSelectedType === 'R') {
      // 법정동명이 있을 경우 추가한다. (법정리는 제외)
      // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
      if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
        extraAddr += data.bname;
      }
      // 건물명이 있고, 공동주택일 경우 추가한다.
      if (data.buildingName !== '' && data.apartment === 'Y') {
        extraAddr +=
          extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
      }
      // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
      if (extraAddr !== '') {
        extraAddr = ' (' + extraAddr + ')';
      }
    }

    setValue('buyerPostcode', data.zonecode, { shouldValidate: true });
    setValue('buyerAddress1', addr, { shouldValidate: true });
  };

  const handleClickPostcode: MouseEventHandler<HTMLButtonElement> = () => {
    openPostcodeSearch(setPostcodeAddress);
  };

  const registerObject = createPurchaseRegisterObject(register);

  const {
    data: productQuantityArray,
    status: productQuantityArrayStatus,
    error: productQuantityArrayError,
    refetch: refetchProductQuantityArray,
  } = useQuery({
    queryKey: ['products', 'quantity'],
    queryFn: async () => {
      const productData = await fetchProducts({
        filters: [
          where(
            'id',
            'in',
            items.map((item) => item.id),
          ),
        ],
        sortOrders: [orderBy('createdAt', 'desc')],
      });

      return productData;
    },
  });

  return {
    registerObject,
    isSubmitting,
    errors,
    handleSubmit,
    submitLogic,
    handleClickPostcode,
    isReadyToCheckout,
    handlePurchaseCheckbox,
    productQuantityArray,
    productQuantityArrayStatus,
    productQuantityArrayError,
  };
};

export default usePurchase;
