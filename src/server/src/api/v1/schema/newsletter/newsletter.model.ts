import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { NewsletterAttributes, NewsletterCreationAttributes } from './newsletter.types';
import { BaseModel } from '../base';

@Table({
  modelName: 'newsletter',
  paranoid: true,
  timestamps: true,
})
export class Newsletter<A extends NewsletterAttributes = NewsletterAttributes, B extends NewsletterCreationAttributes = NewsletterCreationAttributes>
  extends BaseModel<A, B>
  implements NewsletterAttributes {
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    name: string;
  
  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
    description: string;

}
