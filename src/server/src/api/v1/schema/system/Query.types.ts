import { DatedAttributes } from '../types';

export type QueryAttributes = DatedAttributes & {
  remoteAddr: string;
  path: string;
  userAgent: string;
  appVersion: string;
};

export type QueryCreationAttributes = Partial<DatedAttributes> & { 
  remoteAddr: string;
  path: string;
  userAgent: string;
  appVersion: string;
};