import { Column, DataType } from 'sequelize-typescript';

import { PostAttributes, PostCreationAttributes } from './Post.types';
import { BaseModel } from '../base';
import { Interaction } from '../interaction/Interaction.model';
import { InteractionResponse, InteractionType } from '../interaction/Interaction.types';

export abstract class Post<
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

  interactions?: InteractionResponse;
  
  abstract getInteractions(userId?: number, type?: InteractionType | InteractionType[]): Promise<I[] | undefined>;

}