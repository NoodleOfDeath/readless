import Cookies from 'js-cookie';

export function setCookie(name: string, value: string, options?: Cookies.CookieAttributes) {
  Cookies.set(name, window.btoa(value), options);
}

export function clearCookie(name: string, {
  path = '/',
  expires = 0,
  ...other
}: Cookies.CookieAttributes = {}) {
  Cookies.remove(name, {
    expires, path, ...other,
  });
}

export function getCookie(name: string) {
  const value = Cookies.get(name);
  return value ? window.atob(value) : undefined;
}