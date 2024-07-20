import usePostcode from '@/hooks/usePostcode';
import { DaumPostcodeResult } from '@/types/DaumPostcodeType';
import { PurchaseFormData } from '@/types/FormType';
import { ChangeEventHandler, MouseEventHandler, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useCartItems } from '@/hooks/useCartItems';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { v4 } from 'uuid';
import { toast } from 'sonner';
import { Payment, processPayment } from '@/services/paymentService';
import { createPurchaseRegisterObject } from '@/utils/createRegisterObject';

const usePurchase = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
  } = useForm<PurchaseFormData>();
  const { openPostcodeSearch } = usePostcode();
  const { totalPrice, items } = useCartItems();
  const { userInfo } = useFirebaseAuth();
  const [isReadyToCheckout, setIsReadyToCheckout] = useState<boolean>(false);

  const handleUpdateCheckbox: ChangeEventHandler<HTMLInputElement> = (
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
    const orderId: string = userInfo!.uid + v4();
    console.log(orderId, orderId.length);
    try {
      /**
       * Toss Payments 로직
       */
      const paymentResultData = await processPayment({
        totalPrice,
        orderId,
        items,
        email: data.buyerEmail,
        name: data.buyerName,
        phoneNumber: data.buyerPhoneNumber,
      });

      toast.success(
        `"${(paymentResultData as Payment).orderName}" 주문 건의 결제액 "${(paymentResultData as Payment).totalAmount.toLocaleString()}원" 결제가 성공적으로 완료됐습니다.`,
      );
    } catch (error: unknown) {
      toast.error((error as Error).message);
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

  return {
    registerObject,
    isSubmitting,
    errors,
    handleSubmit,
    submitLogic,
    handleClickPostcode,
    isReadyToCheckout,
    handleUpdateCheckbox,
  };
};

export default usePurchase;
