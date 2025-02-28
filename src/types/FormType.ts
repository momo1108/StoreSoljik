/**
 * react-hook-form 에서 사용할 회원가입, 로그인 입력필드들
 */
export type SignupFormDataType = {
  email: string;
  password: string; // DB 에는 저장하지 않는 필드(인증은 Authentication 으로만 진행)
  // accountType: '구매자' | '판매자';
  // nickname: string;
};
export type SigninFormDataType = {
  email: string;
  password: string;
  isMaintainChecked: boolean;
};

/**
 * react-hook-form 에서 사용할 product 입력필드들
 */
export type ProductFormData = {
  images: FileList; // 실제 input
  productName: string;
  productDescription: string;
  productCategory: string;
  productPrice: string;
  productQuantity: string;
};

/**
 * react-hook-form 에서 사용할 구매자 정보 입력필드들
 */
export type PurchaseFormData = {
  buyerName: string;
  buyerPhoneNumber: string;
  buyerEmail: string;
  buyerPostcode: string;
  buyerAddress1: string;
  buyerAddress2: string;
};
