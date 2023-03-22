import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { ReferralAttributes, ReferralCreationAttributes } from './Referral.types';
import { BaseModel } from '../base';

@Table({
  modelName: 'referral',
  paranoid: true,
  timestamps: true,
})
export class Referral extends BaseModel<ReferralAttributes, ReferralCreationAttributes> implements ReferralAttributes {

  @Column({ type: DataType.INTEGER })
    referredById: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(2083),
  })
    remoteAddr: string;

  @Column({ type: DataType.STRING(2083) })
    origin?: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(2083),
  })
    target: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
    userAgent: string;

  @Column({ type: DataType.TEXT })
    geolocation: string;

}
