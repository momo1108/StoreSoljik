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

export const getIsoTime: (
  isoString: string,
  includeSecond?: boolean,
) => string = (isoString, includeSecond = false) =>
  includeSecond ? isoString.slice(11, 19) : isoString.slice(11, 16);

export const getIsoDay: (isoString: string) => string = (isoString) => {
  const date = new Date(isoString);
  const koreanDay = ['일', '월', '화', '수', '목', '금', '토'];
  return koreanDay[date.getDay()];
};

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

type LoadScript = (src: string, id: string) => Promise<void>;

export const loadScript: LoadScript = (src, id) => {
  return new Promise((resolve, reject) => {
    if (document.getElementById('KakaoPostcodeApi')) resolve();
    else {
      const script = document.createElement('script');
      script.id = id;
      script.src = src;
      script.async = true;
      script.onload = () => {
        resolve();
      };
      script.onerror = () => {
        reject();
      };
      document.body.appendChild(script);
    }
  });
};

export const isEqual = (obj1: unknown, obj2: unknown) =>
  obj1 === obj2 || Object.is(obj1, obj2);
