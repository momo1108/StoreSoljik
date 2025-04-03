import { useRef, useState, useCallback } from 'react';

// useState와 useRef를 동기화해서 같이 쓸 수 있는 커스텀 훅
export function useStateWithRef<T>(
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, React.MutableRefObject<T>] {
  const [state, setState] = useState<T>(initialValue);
  const ref = useRef<T>(state);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setState((prev) => {
      let next;

      if (typeof value === 'function') next = (value as (prev: T) => T)(prev);
      else next = value;

      ref.current = next;

      return next;
    });
  }, []);

  return [state, setValue, ref];
}
