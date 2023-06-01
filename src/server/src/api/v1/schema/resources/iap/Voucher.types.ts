import { DatedAttributes } from '../../types';

export type VoucherAttributes = DatedAttributes & {
  token: string;
  credits: number;
  vendor: 'apple' | 'google';
  data: string;
};

export type VoucherCreationAttributes = Partial<DatedAttributes> & {
  token: string;
  credits: number;
  vendor: 'apple' | 'google';
  data: string;
};