import { Column, DataType, Model } from 'sequelize-typescript';

import { DatedAttributes } from './dated';
import { POST_ATTRS, TITLED_CATEGORIZED_POST_ATTRS } from './types';

export type Attr<Model, K extends keyof Model> = {
  [Key in K]: Model[Key];
};

export type PostAttributes = DatedAttributes & {
  text: string;
  abridged: string;
  summary: string;
  shortSummary: string;
  bullets: string[];
  imagePrompt: string;
};

export type PostCreationAttributes = DatedAttributes & {
  text: string;
  abridged: string;
  summary: string;
  shortSummary: string;
  bullets: string[];
  imagePrompt: string;
};

export type PostAttr = Attr<Post, typeof POST_ATTRS[number]>;

export abstract class Post<
    A extends PostAttributes = PostAttributes,
    B extends PostCreationAttributes = PostCreationAttributes,
  >
  extends Model<A, B>
  implements PostAttributes
{
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<Post>): Partial<Post> {
    return defaults ?? {};
  }

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
    text: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
    abridged: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
    summary: string;

  @Column({
    type: DataType.STRING(1024),
    allowNull: false,
  })
    shortSummary: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING(1024)),
    defaultValue: [],
  })
    bullets: string[];
  
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
    imagePrompt: string;
}

export type TitledCategorizedPostAttributes = PostAttributes & {
  title: string;
  category: string;
  subcategory: string;
  tags: string[];
};

export type TitledCategorizedPostCreationAttributes = PostCreationAttributes & {
  title: string;
  category: string;
  subcategory: string;
  tags: string[];
};

export type TitledCategorizedPostAttr = Attr<TitledCategorizedPost, typeof TITLED_CATEGORIZED_POST_ATTRS[number]>;

export abstract class TitledCategorizedPost<
    A extends TitledCategorizedPostAttributes = TitledCategorizedPostAttributes,
    B extends TitledCategorizedPostCreationAttributes = TitledCategorizedPostCreationAttributes,
  >
  extends Post<A, B>
  implements TitledCategorizedPostAttributes
{
  static json(defaults?: Partial<TitledCategorizedPost>): Partial<TitledCategorizedPost> {
    return defaults ?? {};
  }

  @Column({
    type: DataType.STRING(1024),
    allowNull: false,
  })
    title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    category: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    subcategory: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
    tags: string[];
}
