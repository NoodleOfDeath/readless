import {
  Column,
  DataType,
  Index,
  Table,
} from 'sequelize-typescript';

import { RecapSummaryAttributes, RecapSummaryCreationAttributes } from './RecapSummary.types';
import { BaseModel } from '../../base';

@Table({
  modelName: 'recap_summary',
  paranoid: true,
  timestamps: true,
})
export class RecapSummary<A extends RecapSummaryAttributes = RecapSummaryAttributes, B extends RecapSummaryCreationAttributes = RecapSummaryCreationAttributes> extends BaseModel<A, B> implements RecapSummaryAttributes {

  @Index({
    name: 'recap_summaries_unique_key',
    type: 'UNIQUE',
    unique: true,
  })
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare parentId: number;

  @Index({
    name: 'recap_summaries_unique_key',
    type: 'UNIQUE',
    unique: true,
  })
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare summaryId: number;
  
}