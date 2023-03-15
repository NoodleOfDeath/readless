import {
  Column, DataType, Model, Table 
} from 'sequelize-typescript';

import { DatedAttributes } from '../dated';

export type NewsletterAttributes = DatedAttributes & {
  name: string;
  description: string;
};

export type NewsletterCreationAttributes = DatedAttributes & {
  name: string;
  description: string;
};

@Table({
  modelName: 'newsletter',
  timestamps: true,
  paranoid: true,
})
export class Newsletter<A extends NewsletterAttributes = NewsletterAttributes, B extends NewsletterCreationAttributes = NewsletterCreationAttributes>
  extends Model<A, B>
  implements NewsletterAttributes
{
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<Newsletter>): Partial<Newsletter> {
    return defaults ?? {};
  }
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    name: string;
  
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
    description: string;

}
