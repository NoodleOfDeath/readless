import { API_BASE_URL } from '@env';

import { Api } from './api/Api';

export * from './api/Api';

export const API = new Api({ baseURL: API_BASE_URL }).v1;