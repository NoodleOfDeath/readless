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
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare parentId: number;

  @Index({
    name: 'summary_relations_sibling_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare siblingId: number;
  
  @Column({
    defaultValue: 1,
    type: DataType.DOUBLE,
  })
  declare confidence?: number;
  
}