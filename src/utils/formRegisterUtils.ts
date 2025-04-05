import {
  ProductFormData,
  PurchaseFormData,
  SignupFormDataType,
} from '@/types/FormType';
import { UseFormRegister } from 'react-hook-form';

/**
 * 회원가입 시 Input Element 에 사용될 속성들을 반환하는 메서드
 * react-hook-form 에서 제공하는 register 메서드를 활용한다
 * @param register react-hook-form 의 useForm 에서 불러온 register 메서드
 * @returns input element 에 적용할 register 메서드의 반환값(UseFormRegisterReturn)
 */
export const createSignupRegisterObject = (
  register: UseFormRegister<SignupFormDataType>,
) => ({
  // registerAccountType: register('accountType', {
  //   required: '계정 종류 선택은 필수입니다.',
  // }),

  registerEmail: register('email', {
    required: '아이디는 필수 입력입니다.',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: '잘못된 이메일 형식입니다.',
    },
    validate: (value: string) =>
      !!value.trim() || '공백이 아닌 내용을 입력해주세요.',
  }),

  registerPassword: register('password', {
    minLength: {
      value: 10,
      message: '패스워드는 10자 이상이어야 합니다.',
    },
    pattern: {
      value:
        /(((?=.*\d)(?=.*[a-z]))|((?=.*\d)(?=.*[A-Z]))|((?=.*\d)(?=.*[\W_]))|((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[\W_]))|((?=.*[A-Z])(?=.*[\W_]))).+/,
      message: '잘못된 규칙의 패스워드입니다.',
    },
    required: '패스워드는 필수 입력입니다.',
  }),

  // registerNickname: register('nickname', {
  //   required: '닉네임은 필수 입력입니다.',
  //   pattern: {
  //     value: /^[0-9a-zA-Z가-힣\x20]*$/,
  //     message: '한글/영어/숫자만 사용해주세요.',
  //   },
  //   validate: (value: string) =>
  //     !!value.trim() || '공백이 아닌 내용을 입력해주세요.',
  //   minLength: {
  //     value: 2,
  //     message: '닉네임은 2자 이상이어야 합니다.',
  //   },
  //   maxLength: {
  //     value: 10,
  //     message: '닉네임은 10자 이내여야 합니다.',
  //   },
  // }),
});

/**
 * 판매 상품 등록 / 수정 시 Input Element 에 사용될 속성들을 반환하는 메서드
 * react-hook-form 에서 제공하는 register 메서드를 활용한다
 * @param register react-hook-form 의 useForm 에서 불러온 register 메서드
 * @param type 판매 상품 등록 시 'registration', 판매 상품 정보 수정 시 'update'
 * @returns input element 에 적용할 register 메서드의 반환값(UseFormRegisterReturn)
 */
export const createProductRegisterObject = (
  register: UseFormRegister<ProductFormData>,
  type: 'registration' | 'update',
) => ({
  productImages:
    type === 'registration'
      ? register('images', {
          required: '이미지 등록은 필수입니다.',
        })
      : register('images'),

  productCategory: register('productCategory', {
    required: '카테고리명은 필수 입력입니다.',
    onBlur: (event) => {
      event.target.value = event.target.value.trim();
    },
    validate: (value: string) =>
      !!value.trim() || '공백이 아닌 내용을 입력해주세요.',
    maxLength: {
      value: 10,
      message: '카테고리명은 10자 이내여야 합니다.',
    },
  }),

  productName: register('productName', {
    required: '상품명은 필수 입력입니다.',
    onBlur: (event) => {
      event.target.value = event.target.value.trim();
    },
    validate: (value: string) =>
      !!value.trim() || '공백이 아닌 내용을 입력해주세요.',
    maxLength: {
      value: 30,
      message: '상품명은 30자 이내여야 합니다.',
    },
  }),

  productDescription: register('productDescription', {
    required: '상품설명은 필수 입력입니다.',
    onBlur: (event) => {
      event.target.value = event.target.value.trim();
    },
    validate: (value: string) =>
      !!value.trim() || '공백이 아닌 내용을 입력해주세요.',
    maxLength: {
      value: 300,
      message: '상품설명은 300자 이내여야 합니다.',
    },
  }),

  productPrice: register('productPrice', {
    required: '상품가격은 필수 입력입니다.',
    min: {
      value: 0,
      message: '최저 가격은 0원부터 가능합니다.',
    },
    max: {
      value: 99999999,
      message: '최대 가격은 1억원 미만입니다.',
    },
  }),

  productQuantity: register('productQuantity', {
    required: '재고량은 필수 입력입니다.',
    min: {
      value: 0,
      message: '재고량은 0개부터 가능합니다.',
    },
    max: {
      value: 10000,
      message: '최대 재고량은 10000개 입니다.',
    },
  }),
});

/**
 * 상품 구매 시 Input Element 에 사용될 속성들을 반환하는 메서드
 * react-hook-form 에서 제공하는 register 메서드를 활용한다
 * @param register react-hook-form 의 useForm 에서 불러온 register 메서드
 * @returns input element 에 적용할 register 메서드의 반환값(UseFormRegisterReturn)
 */
export const createPurchaseRegisterObject = (
  register: UseFormRegister<PurchaseFormData>,
) => ({
  buyerName: register('buyerName', {
    required: '구매자는 필수 입력입니다.',
    onBlur: (event) => {
      event.target.value = event.target.value.trim();
    },
    validate: (value: string) =>
      !!value.trim() || '공백이 아닌 내용을 입력해주세요.',
    pattern: {
      value: /^[가-힣\x20]*$/,
      message: '한글만 사용해주세요.',
    },
    minLength: {
      value: 2,
      message: '이름은 2자 이상 10자 이하여야 합니다.',
    },
    maxLength: {
      value: 10,
      message: '이름은 2자 이상 10자 이하여야 합니다.',
    },
  }),

  buyerPhoneNumber: register('buyerPhoneNumber', {
    required: '휴대전화번호는 필수 입력입니다.',
    onBlur: (event) => {
      event.target.value = event.target.value.trim();
    },
    validate: (value: string) =>
      !!value.trim() || '공백이 아닌 내용을 입력해주세요.',
    pattern: {
      value: /^(01[016789]{1})-?[0-9]{3,4}-?[0-9]{4}$/,
      message: '잘못된 휴대전화번호 형식입니다.',
    },
  }),

  buyerEmail: register('buyerEmail', {
    required: '이메일은 필수 입력입니다.',
    onBlur: (event) => {
      event.target.value = event.target.value.trim();
    },
    validate: (value: string) =>
      !!value.trim() || '공백이 아닌 내용을 입력해주세요.',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: '잘못된 이메일 형식입니다.',
    },
  }),

  buyerPostcode: register('buyerPostcode', {
    required: '우편번호는 필수 입력입니다.',
    onBlur: (event) => {
      event.target.value = event.target.value.trim();
    },
    validate: (value: string) =>
      !!value.trim() || '공백이 아닌 내용을 입력해주세요.',
    pattern: {
      value: /^[0-9]{5}$/i,
      message: '잘못된 우편번호 형식입니다.',
    },
  }),

  buyerAddress1: register('buyerAddress1', {
    required: '주소는 필수 입력입니다.',
    onBlur: (event) => {
      event.target.value = event.target.value.trim();
    },
    validate: (value: string) =>
      !!value.trim() || '공백이 아닌 내용을 입력해주세요.',
    maxLength: {
      value: 30,
      message: '주소는 30자 이하여야 합니다.',
    },
  }),

  buyerAddress2: register('buyerAddress2', {
    required: '상세주소는 필수 입력입니다.',
    onBlur: (event) => {
      event.target.value = event.target.value.trim();
    },
    validate: (value: string) =>
      !!value.trim() || '공백이 아닌 내용을 입력해주세요.',
    maxLength: {
      value: 30,
      message: '상세주소는 30자 이하여야 합니다.',
    },
  }),
});
