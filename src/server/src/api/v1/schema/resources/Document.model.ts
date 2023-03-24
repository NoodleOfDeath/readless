import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { DocumentAttributes, DocumentCreationAttributes } from './Document.types';
import { BaseModel } from '../base';

@Table({
  modelName: 'document',
  paranoid: true,
  timestamps: true,
})
export class Document<
    A extends DocumentAttributes = DocumentAttributes,
    B extends DocumentCreationAttributes = DocumentCreationAttributes,
  >
  extends BaseModel<A, B>
  implements DocumentAttributes {

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    name: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
    content: string;

}
