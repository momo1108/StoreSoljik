import { useEffect, useRef } from 'react';

const useIdleCallback = (
  callback: () => void,
  dependency: unknown[],
  timeout: number = 2000,
) => {
  const idleCallbackId = useRef<number | null>(null);

  useEffect(() => {
    if (!('requestIdleCallback' in window)) {
      callback(); // requestIdleCallback이 지원되지 않으면 바로 실행
      return;
    }

    idleCallbackId.current = requestIdleCallback(callback, { timeout });

    return () => {
      if (idleCallbackId.current) {
        cancelIdleCallback(idleCallbackId.current);
      }
    };
  }, [callback, ...dependency, timeout]);
};

export default useIdleCallback;
