import { Column, DataType } from 'sequelize-typescript';

import { PostAttributes, PostCreationAttributes } from './Post.types';
import { Interaction } from './interaction/Interaction.model';
import { InteractionResponse } from './interaction/Interaction.types';
import { BaseModel } from '../base';

export abstract class Post<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    I extends Interaction,
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

  declare interactions?: InteractionResponse;

}
