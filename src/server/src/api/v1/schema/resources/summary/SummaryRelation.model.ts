import {
  Column,
  DataType,
  Index,
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

  @Index({
    name: 'summary_relations_sibling_key',
    type: 'UNIQUE',
    unique: true,
  })
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare parentId: number;

  @Index({
    name: 'summary_relations_sibling_key',
    type: 'UNIQUE',
    unique: true,
  })
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare siblingId: number;
  
  @Column({
    allowNull: false,
    type: DataType.DOUBLE,
  })
  declare confidence: number;
  
}