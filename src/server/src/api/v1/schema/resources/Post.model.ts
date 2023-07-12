import { Column, DataType } from 'sequelize-typescript';

import { PostAttributes, PostCreationAttributes } from './Post.types';
import { PublicMediaAttributes } from './media/Media.types';
import { BaseModel } from '../base';

export abstract class Post<
    A extends PostAttributes = PostAttributes,
    B extends PostCreationAttributes = PostCreationAttributes,
  >
  extends BaseModel<A, B>
  implements PostAttributes {

  @Column({
    allowNull: false,
    type: DataType.STRING(1024),
  })
  declare title: string;

  @Column({ type: DataType.TEXT })
  declare text?: string;

  @Column({ type: DataType.STRING(2083) })
  declare imageUrl?: string;
  
  declare media?: { [key: string]: PublicMediaAttributes };

}
