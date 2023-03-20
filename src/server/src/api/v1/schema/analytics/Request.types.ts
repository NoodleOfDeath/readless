import { DatedAttributes } from '../types';

export type RequestAttributes = DatedAttributes & {
  remoteAddr: string[];
  referrer?: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}

export type RequestCreationAttributes = { 
  remoteAddr: string[];
  referrer?: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}