import {
  PUBLIC_VOUCHER_ATTRIBUTES,
  PublicVoucherAttributes,
  VoucherAttributes,
  VoucherCreationAttributes,
} from '../../types';

export type Vendor = 'apple' | 'google';

export type IapVoucherAttributes = VoucherAttributes & {
  vendor: Vendor;
  productId: string;
};

export type IapVoucherCreationAttributes = VoucherCreationAttributes & {
  vendor: Vendor;
  productId: string;
};

export type PublicIapVoucherAttributes = PublicVoucherAttributes;

export const PUBLIC_IAP_VOUCHER_ATTRIBUTES = PUBLIC_VOUCHER_ATTRIBUTES;