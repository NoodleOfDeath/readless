import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { DatedAttributes } from '../dated';

export type ReferralAttributes = DatedAttributes & {
  /** id of a user if ref link was created while logged in */
  referredById?: number;
  /** the IP address this referral was accessed from */
  remoteAddr: string;
  /** the url path this referral was generated from */
  origin?: string;
  /** the url path of the referral destination */
  target: string;
  /** the user agent info of the consumer of this referral */
  userAgent: string;
  /** geolocation of the referrer */
  geolocation?: string;
};

export type ReferralCreationAttributes = ReferralAttributes;

@Table({
  modelName: 'referral',
  timestamps: true,
  paranoid: true,
})
export class Referral extends Model<ReferralAttributes, ReferralCreationAttributes> implements ReferralAttributes {

  @Column({ type: DataType.INTEGER })
    referredById: number;

  @Column({
    type: DataType.STRING(2083),
    allowNull: false,
  })
    remoteAddr: string;

  @Column({ type: DataType.STRING(2083) })
    origin?: string;

  @Column({
    type: DataType.STRING(2083),
    allowNull: false,
  })
    target: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
    userAgent: string;

  @Column({ type: DataType.TEXT })
    geolocation: string;

}
