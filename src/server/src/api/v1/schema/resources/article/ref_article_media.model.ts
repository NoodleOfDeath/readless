import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import {
  RefArticleMediaAttributes,
  RefArticleMediaCreationAttributes,
} from './ref_article_media.types';
import { BaseModel } from '../../base';

@Table({
  modelName: '_ref_article_media',
  paranoid: true,
  timestamps: true,
})
export class RefArticleMedia<A extends RefArticleMediaAttributes = RefArticleMediaAttributes, B extends RefArticleMediaCreationAttributes = RefArticleMediaCreationAttributes> extends BaseModel<A, B> implements RefArticleMediaAttributes {
    
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    articleId: number;
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    mediaId: number;

}