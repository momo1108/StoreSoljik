import { CartItem } from '@/hooks/useCartItems';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

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
  sellerId: string;
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
   * 하나의 상품에는 최대 6가지의 이미지 key-value 쌍이 존재
   * 원본사이즈 - 원본타입, webp
   * 600px - 원본타입, webp
   * 250px - 원본타입, webp
   */
  productImageUrlArray: Record<string, string>[];
  /**
   * new Date()에 new Date().getTimezoneOffset() * 60000 를 빼준다.(한국시간)
   * toISOString 메서드로 변환한다.
   */
  createdAt: string;
  updatedAt: string;
};

export enum OrderStatus {
  All = 'All', // 전체 주문
  OrderCreated = 'OrderCreated', // 주문 생성 후 결제 전
  OrderCompleted = 'OrderCompleted', // 주문 완료
  AwaitingShipment = 'AwaitingShipment', // 발송 대기
  ShipmentStarted = 'ShipmentStarted', // 발송 시작
  OrderCancelled = 'OrderCancelled', // 주문 취소
}

export type KoreanOrderStatus =
  | '전체'
  | '주문 생성'
  | '주문 완료'
  | '발송 대기'
  | '발송 시작'
  | '주문 취소';

export const allOrderStatusArray = [
  OrderStatus.All,
  OrderStatus.OrderCreated,
  OrderStatus.OrderCompleted,
  OrderStatus.AwaitingShipment,
  OrderStatus.ShipmentStarted,
  OrderStatus.OrderCancelled,
];

export const orderStatusLevel: Record<OrderStatus, number> = {
  All: 0,
  OrderCreated: 0,
  OrderCancelled: 0,
  OrderCompleted: -3,
  AwaitingShipment: -2,
  ShipmentStarted: -1,
};

export const koreanOrderStatusMap: Record<OrderStatus, KoreanOrderStatus> = {
  All: '전체',
  OrderCreated: '주문 생성',
  OrderCompleted: '주문 완료',
  AwaitingShipment: '발송 대기',
  ShipmentStarted: '발송 시작',
  OrderCancelled: '주문 취소',
};

/**
 * 주문 DB 에 저장될 스키마. 같은 주문에 대해서 각 상품별로 따로 저장되기 때문에
 * 같은 주문의 각 상품들은 orderId 필드가 같은 값을 가진다.
 * @property {string} orderId 단일 주문 롤백 시 사용할 조건으로 필요. firestore 자동 생성된 값을 저장.
 * @property {string} batchOrderId 배치 주문 롤백 시 사용할 조건으로 필요. buyerEmail_isoString 형태(같은 주문끼리 중복가능)
 * @property {string} buyerId 구매자 id
 * @property {string} orderName 주문명(Ex. 파란색 티셔츠 외 7건)
 * @property {CartItem} orderData 주문에 포함된 각 상품 목록.(id 항목을 통해 상품 상페 정보를 불러온다.)
 * @property {OrderStatus} orderStatus 주문 상태
 * @property {string} createdAt 생성 날짜
 * @property {string} updatedAt 수정 날짜
 */
export type OrderSchema = {
  orderId: string;
  batchOrderId: string;
  buyerId: string;
  sellerId: string;
  orderName: string;
  orderData: CartItem;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

export type QueryDocumentType = QueryDocumentSnapshot<
  DocumentData,
  DocumentData
>;

export type PageParamType = QueryDocumentType | null;
