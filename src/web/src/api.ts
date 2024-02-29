import { Api } from './gen/Api';

export * from './gen/Api';

export const API = new Api({ baseUrl: process.env.NEXT_PUBLIC_API_ENDPOINT }).v1;
