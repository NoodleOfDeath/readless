import { DatedAttributes } from '../../types';

export type VoucherAttributes = DatedAttributes & {
  token: string;
  vendor: 'apple' | 'google';
  data: string;
};

export type VoucherCreationAttributes = Partial<DatedAttributes> & {
  token: string;
  vendor: 'apple' | 'google';
  data: string;
};