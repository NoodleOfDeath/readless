import { DatedAttributes } from '../types';

export type QueryAttributes = DatedAttributes & {
  remoteAddr: string;
  path: string;
  userAgent?: string;
  appVersion?: string;
  locale?: string;
  platform?: string;
  userId?: number;
};

export type QueryCreationAttributes = Partial<DatedAttributes> & { 
  remoteAddr: string;
  path: string;
  userAgent?: string;
  appVersion?: string;
  locale?: string;
  platform?: string;
  userId?: number;
};