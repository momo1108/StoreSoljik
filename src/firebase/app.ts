import { initializeApp } from 'firebase/app';
import dotenv from 'dotenv';

// Node.js 환경일 경우 dotenv 로드
if (typeof process !== 'undefined' && process.env) {
  dotenv.config();
}

// 실행 환경(Vite 로 실행되는 웹앱 or 리팩토링 스크립트만 실행하는 Node.js 환경)에 따라 환경 변수 가져오기
const getEnv = (key: string) => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key];
  }
  return process.env[key];
};

const firebaseConfig = {
  apiKey: getEnv('VITE_apiKey'),
  authDomain: getEnv('VITE_authDomain'),
  projectId: getEnv('VITE_projectId'),
  storageBucket: getEnv('VITE_storageBucket'),
  messagingSenderId: getEnv('VITE_messagingSenderId'),
  appId: getEnv('VITE_appId'),
  measurementId: getEnv('VITE_measurementId'),
};

export const app = initializeApp(firebaseConfig);
