import { DatedAttributes } from '../../types';

export type Vendor = 'apple' | 'google';

export type VoucherAttributes = DatedAttributes & {
  uuid: string;
  vendor: Vendor;
  productId: string;
  data: string;
  expiresAt: Date;
  token: string;
};

export type VoucherCreationAttributes = Partial<DatedAttributes> & {
  uuid: string;
  vendor: Vendor;
  productId: string;
  data: string;
  expiresAt: Date;
  token: string;
};

export type PublicVoucherAttributes = {
  token: string;
};

export const PUBLIC_VOUCHER_ATTRIBUTES = ['token'] as const;