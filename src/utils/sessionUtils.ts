import { auth } from '@/firebase';
import { onIdTokenChanged, signOut } from 'firebase/auth';

export const setSessionMaintenance = (
  key: string,
  isMaintainChecked: boolean,
) => {
  localStorage.setItem(key, isMaintainChecked ? 'maintain' : '');
};

export const setSessionTimer = () => {
  const unsubscribe = onIdTokenChanged(auth, async (user) => {
    if (user) {
      //   const tokenResult = await user.getIdTokenResult();
      //   const expirationTime = tokenResult.expirationTime; // 토큰 만료 시간
      //   const expiresInMs = new Date(expirationTime).getTime() - Date.now() + ;
      //   console.log(
      //     `🔍 현재 로그인 토큰 만료까지 남은 시간: ${expiresInMs / 1000}초`,
      //   );
      //   setTimeout(() => {
      //     console.log('⏳ ID 토큰이 만료되어 자동 로그아웃됩니다.');
      //     signOut(auth);
      //   }, 1000); // 만료 시간 이후 로그아웃 실행
    }
  });

  return unsubscribe;
};
