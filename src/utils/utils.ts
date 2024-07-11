export const checkPathIsActive: (path: string) => boolean = (path) => {
  if (path === '/') {
    return path === location.pathname;
  } else {
    return location.pathname.startsWith(path);
  }
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
