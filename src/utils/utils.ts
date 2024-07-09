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
