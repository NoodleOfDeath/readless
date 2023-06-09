import { Table } from 'sequelize-typescript';

import { IapVoucherAttributes, IapVoucherCreationAttributes } from './IapVoucher.types';
import { Voucher } from './Voucher.model';

@Table({
  modelName: 'iap_voucher',
  paranoid: true,
  timestamps: true,
})
export class IapVoucher extends Voucher<IapVoucherAttributes, IapVoucherCreationAttributes> {

}