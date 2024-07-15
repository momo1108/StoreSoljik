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
  /**
   * 자동 생성된 id
   */
  id: string; // unique
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
