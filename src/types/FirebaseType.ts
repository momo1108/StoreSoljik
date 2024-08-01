import { CartItem } from '@/hooks/useCartItems';

export type UserSchema = {
  /**
   * id 는 Authentication 서비스에서 정해진 uid 를 사용한다.
   */
  uid: string; // unique
  email: string; // unique
  password?: string; // DB 에는 저장하지 않는 필드(인증은 Authentication 으로만 진행)
  accountType: '구매자' | '판매자';
  nickname: string;
  /**
   * new Date()에 new Date().getTimezoneOffset() * 60000 를 빼준다.(한국시간)
   * toISOString 메서드로 변환한다.
   */
  createdAt: string;
  updatedAt: string;
};

export type ProductSchema = {
  id: string; // 사용자 uid + uuid
  sellerEmail: string;
  sellerNickname: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
  productSalesrate: number;
  productDescription: string;
  productCategory: string;
  /**
   * 배열 데이터를 JSON.stringify 메서드로 문자열 변환 후 저장
   */
  productImageUrlArray: string[];
  /**
   * new Date()에 new Date().getTimezoneOffset() * 60000 를 빼준다.(한국시간)
   * toISOString 메서드로 변환한다.
   */
  createdAt: string;
  updatedAt: string;
};

export enum OrderStatus {
  OrderCreated = 'OrderCreated', // 주문 생성 후 결제 전
  OrderCompleted = 'OrderCompleted', // 주문 완료
  AwaitingShipment = 'AwaitingShipment', // 발송 대기
  ShipmentStarted = 'ShipmentStarted', // 발송 시작
  OrderCancelled = 'OrderCancelled', // 주문 취소
}

export type OrderSchema = {
  id: string; // 자동 생성된 id
  buyerId: string; // 구매자 id
  orderName: string; // 주문명(Ex. 파란색 티셔츠 외 7건)
  cartItemsArray: CartItem[]; // 주문에 포함된 각 상품 목록.(id 항목을 통해 상품 상페 정보를 불러온다.)
  orderStatus: OrderStatus; // 주문상태
  createdAt: string; // 생성 날짜
  updatedAt: string; // 수정 날짜
};
