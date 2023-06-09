import { DatedAttributes } from '../../types';

export type VoucherAttributes = DatedAttributes & {
  uuid: string;
  data: string;
  expiresAt: Date;
  token: string;
};

export type VoucherCreationAttributes = Partial<DatedAttributes> & {
  uuid: string;
  data: string;
  expiresAt: Date;
  token: string;
};

export type PublicVoucherAttributes = {
  token: string;
};

export const PUBLIC_VOUCHER_ATTRIBUTES = ['token'] as const;