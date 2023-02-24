import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { DatedAttributes } from './dated';

export type ReferralAttributes = DatedAttributes & {
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
