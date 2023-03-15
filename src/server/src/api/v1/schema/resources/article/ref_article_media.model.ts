import {
  Column, DataType, Model, Table, 
} from 'sequelize-typescript';

import { DatedAttributes } from '../../dated';

export type RefArticleMediaAttributes = DatedAttributes & {
  articleId: number;
  mediaId: number;
};

export type RefArticleMediaCreationAttributes = DatedAttributes & {
  articleId: number;
  mediaId: number;
};

@Table({
  modelName: '_ref_article_media',
  timestamps: true,
  paranoid: true,
})
export class RefArticleMedia<A extends RefArticleMediaAttributes = RefArticleMediaAttributes, B extends RefArticleMediaCreationAttributes = RefArticleMediaCreationAttributes> extends Model<A, B> implements RefArticleMediaAttributes {

  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<RefArticleMedia>): Partial<RefArticleMedia> {
    return defaults ?? {};
  }
    
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    articleId: number;
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    mediaId: number;

}