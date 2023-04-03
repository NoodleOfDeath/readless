import { API_ENDPOINT } from '@env';

import { Api } from '~/gen/Api';

export * from '~/gen/Api';

export const API = new Api({ baseUrl: API_ENDPOINT }).v1;