import { toast } from 'sonner';

export const checkPathIsActive: (path: string) => boolean = (path) => {
  if (path === '/') {
    return path === location.pathname;
  } else {
    return location.pathname.startsWith(path);
  }
};

export const getKoreanIsoDatetime = () => {
  const timeOffset = new Date().getTimezoneOffset() * 60000;
  const koreanDatetime = new Date(Date.now() - timeOffset).toISOString();
  return koreanDatetime;
};

export const getIsoDate: (isoString: string) => string = (isoString) =>
  isoString.slice(0, 10);

export const getIsoTime: (isoString: string) => string = (isoString) =>
  isoString.slice(11, 16);

export function compareArray<T>(array1: Array<T>, array2: Array<T>): boolean {
  if (array1.length === array2.length) {
    for (let i = 0; i < array1.length; i++) {
      if (
        typeof array1[i] === typeof array2[i] &&
        typeof array1[i] === 'object'
      )
        return compareArray(array1[i] as Array<T>, array2[i] as Array<T>);
      else if (typeof array1[i] !== typeof array2[i]) return false;
      else if (array1[i] !== array2[i]) return false;
    }
    return true;
  } else return false;
}

export const sleep: (delay: number) => Promise<void> = (delay) =>
  new Promise((resolve) => setTimeout(resolve, delay));

type MessageObject = {
  message?: string;
  description?: string;
};

type LoadScript = (
  src: string,
  successMessages: MessageObject,
  errorMessages: MessageObject,
) => Promise<void>;

export const loadScript: LoadScript = (src, successMessages, errorMessages) => {
  return new Promise((resolve, reject) => {
    if (document.getElementById('KakaoPostcodeApi')) resolve();
    else {
      const script = document.createElement('script');
      script.id = 'KakaoPostcodeApi';
      script.src = src;
      script.async = true;
      script.onload = () => {
        toast.info(successMessages.message, {
          description: successMessages.description,
        });
        resolve();
      };
      script.onerror = () => {
        toast.error(errorMessages.message, {
          description: errorMessages.description,
        });
        reject(new Error(`Failed to load script ${src}`));
      };
      document.body.appendChild(script);
    }
  });
};
