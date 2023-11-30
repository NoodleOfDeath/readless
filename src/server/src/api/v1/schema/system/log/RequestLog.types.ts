import { DatedAttributes } from '../../types';

export type RequestLogAttributes = DatedAttributes & {
  remoteAddr: string;
  path: string;
  userAgent?: string;
  appVersion?: string;
  locale?: string;
  platform?: string;
  userId?: number;
};

export type RequestLogCreationAttributes = Partial<DatedAttributes> & { 
  remoteAddr: string;
  path: string;
  userAgent?: string;
  appVersion?: string;
  locale?: string;
  platform?: string;
  userId?: number;
};