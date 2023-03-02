import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { DatedAttributes } from './dated';
import { User } from './user.model';

export type ReferralAttributes = DatedAttributes & {
  /** id of a user if ref link was created while logged in */
  referrerId?: number;
  /** the url path this referral was copied from */
  referrer: string;
  /** the url path of the referral destination */
  target: string;
  /** the user agent info of the consumer of this referral */
  userAgent: string;
};

export type ReferralCreationAttributes = ReferralAttributes;

@Table({
  modelName: 'referral',
  timestamps: true,
  paranoid: true,
})
export class Referral extends Model<ReferralAttributes, ReferralCreationAttributes> implements ReferralAttributes {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  referrerId: number;

  @Column({
    type: DataType.STRING(2083),
    allowNull: false,
  })
  referrer: string;

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
}
