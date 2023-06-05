import { DatedAttributes } from '../../types';

export type VoucherAttributes = DatedAttributes & {
  token: string;
  vendor: 'apple' | 'google';
  data: string;
  rawData: unknown;
};

export type VoucherCreationAttributes = Partial<DatedAttributes> & {
  token: string;
  vendor: 'apple' | 'google';
  data: string;
  rawData: unknown;
};

export type PublicVoucherAttributes = {
  token: string;
  vendor: 'apple' | 'google';
  data: string;
  rawData: unknown;
};