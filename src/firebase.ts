// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDR7gGOE90bFelJUEwZKkumoeYi5aq-9Tc',
  authDomain: 'buythis-37f33.firebaseapp.com',
  projectId: 'buythis-37f33',
  storageBucket: 'buythis-37f33.appspot.com',
  messagingSenderId: '106439294416',
  appId: '1:106439294416:web:99e4a945330fa7f2ac0dd5',
  measurementId: 'G-XLCR3C7C2M',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
