import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import {
  RefArticleSummaryAttributes,
  RefArticleSummaryCreationAttributes,
} from './RefArticleSummary.types';
import { BaseModel } from '../../base';

@Table({
  modelName: '_ref_article_summary',
  paranoid: true,
  timestamps: true,
})
export class RefArticleSummary<A extends RefArticleSummaryAttributes = RefArticleSummaryAttributes, B extends RefArticleSummaryCreationAttributes = RefArticleSummaryCreationAttributes> extends BaseModel<A, B> implements RefArticleSummaryAttributes {
    
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare articleId: number;
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare sourceId: number;

}