import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
  measurementId: import.meta.env.VITE_measurementId,
};

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
  accountType: '구매자' | '판매자';
  nickname: string;
  productName: string;
  productPrice: number;
  productQunatity: number;
  productDescription: string;
  productCategory: string;
  /**
   * 배열 데이터를 JSON.stringify 메서드로 문자열 변환 후 저장
   */
  productImage: string;
  /**
   * new Date()에 new Date().getTimezoneOffset() * 60000 를 빼준다.(한국시간)
   * toISOString 메서드로 변환한다.
   */
  createdAt: string;
  updatedAt: string;
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
