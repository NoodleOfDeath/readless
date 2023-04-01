import { Column, DataType } from 'sequelize-typescript';

import {
  PostContentAttributes,
  PostContentCreationAttributes,
  ReadingFormat,
} from './PostContent.types';
import { BaseModel } from '../base';

export abstract class PostContent<
    A extends PostContentAttributes = PostContentAttributes,
    B extends PostContentCreationAttributes = PostContentCreationAttributes,
  >
  extends BaseModel<A, B>
  implements PostContentAttributes {

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare parentId: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare format: ReadingFormat;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare content: string;

}