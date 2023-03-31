import { API_ENDPOINT } from '@env';

import { Api } from './api/Api';

export * from './api/Api';

export const API = new Api({ baseURL: API_ENDPOINT }).v1;