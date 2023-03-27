import { Api } from './gen/Api';

export * from './gen/Api';

type HeaderOptions = {
  token?: string;
};

export function headers({ token }: HeaderOptions = {}) {
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

console.log('wtf', process.env.NEXT_PUBLIC_API_ENDPOINT);

const API = new Api({ baseUrl: process.env.NEXT_PUBLIC_API_ENDPOINT }).v1;

export default API;