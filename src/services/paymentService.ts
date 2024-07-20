import { CartItem } from '@/hooks/useCartItems';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { toast } from 'sonner';

// 도큐먼트에는 return 타입이 Promise<RequestPaymentResult> 라고 나와있으나 실제로는 Promise<void> 인걸 발견.
// unknown 으로 받은 후 타입 지정
interface RequestPaymentResult {
  /**
   * 토스페이먼츠에서 발급하는 결제 식별 키입니다. 결제 승인, 조회, 취소 등에 사용되니 반드시 저장하세요.
   */
  paymentKey: string;
  /**
   * 주문번호입니다. 결제를 요청할 때 호출한 `requestPayment()` 메서드로 넘긴 `orderId` 값과 같은지 확인하세요.
   */
  orderId: string;
  /**
   * 결제 금액 정보입니다. `requestPayment()` 메서드로 넘긴 `amount` 값과 같은지 확인하세요.
   */
  amount: {
    /**
     * 결제 금액입니다.
     */
    value: number;
    /**
     * 결제 통화입니다. 일반결제는 `KRW`만 지원합니다. 해외 간편결제(PayPal)는 `USD`만 지원합니다.
     */
    currency: string;
  };
}

export interface Payment {
  orderName: string;
  totalAmount: number;
}

type ProcessPayment = (params: {
  totalPrice: number;
  orderId: string;
  items: CartItem[];
  email: string;
  name: string;
  phoneNumber: string;
}) => Promise<Payment>;

export const processPayment: ProcessPayment = async ({
  totalPrice,
  orderId,
  items,
  email,
  name,
  phoneNumber,
}) => {
  /**
   * Toss Payments 로직
   */
  const tossPayments = await loadTossPayments(
    import.meta.env.VITE_tossClientKey,
  );
  const tossPaymentsWindow = tossPayments.payment({
    customerKey: import.meta.env.VITE_tossClientKey,
  });
  const requestPaymentResult: unknown = await tossPaymentsWindow.requestPayment(
    {
      method: 'CARD',
      amount: {
        currency: 'KRW',
        value: totalPrice,
      },
      orderId,
      orderName: `${items[0].productName}${items.length > 1 ? ` 외 ${items.length - 1}건` : ''}`,
      customerEmail: email,
      customerName: name,
      customerMobilePhone: phoneNumber.replace(/-/g, ''),
      windowTarget: 'iframe',
      card: {
        useEscrow: false,
        flowMode: 'DEFAULT',
        useCardPoint: false,
        useAppCardOnly: false,
      },
    },
  );
  const confirmData = requestPaymentResult as RequestPaymentResult;

  toast.info('결제의 승인을 요청하는 중입니다.');

  const paymentResult = await fetch(
    'https://api.tosspayments.com/v1/payments/confirm',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(import.meta.env.VITE_tossSecretKey + ':')}`, // toss 에서 요구하는 postfix 추가
      },
      body: JSON.stringify({
        ...confirmData,
        amount: confirmData.amount.value,
      }),
    },
  );

  const paymentResultData = await paymentResult.json();

  if (!paymentResult.ok) {
    const errorInstance = new Error();
    errorInstance.name = paymentResultData.code;
    errorInstance.message = paymentResultData.message;

    throw errorInstance;
  }

  return paymentResultData;
};
