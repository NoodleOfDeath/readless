import { 
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { VoucherAttributes, VoucherCreationAttributes } from './Voucher.types';
import { BaseModel } from '../../base';

@Table({
  modelName: 'voucher',
  paranoid: true,
  timestamps: true,
})
export class Voucher<
    A extends VoucherAttributes = VoucherAttributes,
    B extends VoucherCreationAttributes = VoucherCreationAttributes,
  > extends BaseModel<A, B> implements VoucherAttributes {
    
  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare uuid: string;
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare vendor: 'apple' | 'google';

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare productId: string;
  
  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare data: string;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  declare expiresAt: Date;
  
  @Column({
    allowNull: false,
    type: DataType.TEXT,
    unique: true,
  })
  declare token: string;

  get expired() {
    return this.expiresAt.valueOf() < Date.now();
  }
  
}