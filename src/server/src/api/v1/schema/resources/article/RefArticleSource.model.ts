import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import {
  RefArticleSourceAttributes,
  RefArticleSourceCreationAttributes,
} from './RefArticleSource.types';
import { BaseModel } from '../../base';

@Table({
  modelName: '_ref_article_source',
  paranoid: true,
  timestamps: true,
})
export class RefArticleSource<A extends RefArticleSourceAttributes = RefArticleSourceAttributes, B extends RefArticleSourceCreationAttributes = RefArticleSourceCreationAttributes> extends BaseModel<A, B> implements RefArticleSourceAttributes {
    
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    articleId: number;
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    sourceId: number;

}