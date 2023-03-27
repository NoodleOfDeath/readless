import { Column, DataType } from 'sequelize-typescript';

import {
  PostAttributes,
  PostCreationAttributes,
  TitledCategorizedPostAttributes,
  TitledCategorizedPostCreationAttributes,
} from './Post.types';
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
    type: DataType.TEXT,
  })
    text: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
    longSummary: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
    summary: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(1024),
  })
    shortSummary: string;

  @Column({
    defaultValue: [],
    type: DataType.ARRAY(DataType.STRING(1024)),
  })
    bullets: string[];
  
  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
    imagePrompt: string;

  interactions: InteractionResponse;
  
  abstract getInteractions(userId?: number, type?: InteractionType | InteractionType[]): Promise<I[] | undefined>;

}

export abstract class TitledCategorizedPost<
    I extends Interaction,
    A extends TitledCategorizedPostAttributes = TitledCategorizedPostAttributes,
    B extends TitledCategorizedPostCreationAttributes = TitledCategorizedPostCreationAttributes> extends Post<I, A, B>
  implements TitledCategorizedPostAttributes {

  @Column({
    allowNull: false,
    type: DataType.STRING(1024),
  })
    title: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    category: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    subcategory: string;

  @Column({
    defaultValue: [],
    type: DataType.ARRAY(DataType.STRING),
  })
    tags: string[];

}
