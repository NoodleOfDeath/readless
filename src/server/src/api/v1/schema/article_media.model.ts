import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from './dated';
import { Article } from './article.model';
import { Media } from './media.model';

export type ArticleMediaAttributes = DatedAttributes & {
  articleId: number;
  mediaId: number;
};

export type ArticleMediaCreationAttributes = DatedAttributes & {
  articleId: number;
  mediaId: number;
};

@Table({
  modelName: 'article_media',
  timestamps: true,
  paranoid: true,
})
export class ArticleMedia<A extends ArticleMediaAttributes = ArticleMediaAttributes, B extends ArticleMediaCreationAttributes = ArticleMediaCreationAttributes> extends Model<A, B> implements ArticleMediaAttributes {
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<ArticleMedia>): Partial<ArticleMedia> {
    return defaults ?? {};
  }
    
  @ForeignKey(() => Article)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    articleId: number;
  
  @ForeignKey(() => Media)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    mediaId: number;
  
  get article() {
    return Article.findByPk(this.articleId);
  }
    
  get media() { 
    return Media.findByPk(this.mediaId);
  }

}