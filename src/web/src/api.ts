import { Api } from './gen/Api';

export * from './gen/Api';

const API = new Api({ baseUrl: process.env.NEXT_PUBLIC_API_ENDPOINT }).v1;

export default API;