import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import {
  SummaryRelationAttributes,
  SummaryRelationCreationAttributes,
} from './SummaryRelation.types';
import { BaseModel } from '../../base';

@Table({
  modelName: 'summary_relation',
  paranoid: true,
  timestamps: true,
})
export class SummaryRelation<A extends SummaryRelationAttributes = SummaryRelationAttributes, B extends SummaryRelationCreationAttributes = SummaryRelationCreationAttributes> extends BaseModel<A, B> implements SummaryRelationAttributes {

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare parentId: number;
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare siblingId: number;
  
}