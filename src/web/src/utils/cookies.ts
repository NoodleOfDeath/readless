import Cookies from 'js-cookie';
import ms from 'ms';

// 2 days
export const DEFAULT_SESSION_DURATION_MS = ms('1d');
export const DEFAULT_SESSION_PATH = '/';

export const setCookie = async (name: string, value: string, {
  expires = DEFAULT_SESSION_DURATION_MS,
  path = DEFAULT_SESSION_PATH,
  ...other
}: Partial<Cookies.CookieAttributes> = {}) => {
  Cookies.set(name, window.btoa(value), {
    expires, path, ...other, 
  });
};
  
export const clearCookie = async (name: string, {
  path = DEFAULT_SESSION_PATH,
  expires = 0,
  ...other
}: Partial<Cookies.CookieAttributes> = {}) => {
  Cookies.remove(name, {
    expires, path, ...other,
  });
};
  
export const getCookie = async (name: string) => {
  const value = Cookies.get(name);
  return value ? window.atob(value) : undefined;
};
  