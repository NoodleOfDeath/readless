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
  declare text: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare longSummary: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare summary: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(1024),
  })
  declare shortSummary: string;

  @Column({
    defaultValue: [],
    type: DataType.ARRAY(DataType.STRING(1024)),
  })
  declare bullets: string[];
  
  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare imagePrompt: string;

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
  declare title: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare category: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare subcategory: string;

  @Column({
    defaultValue: [],
    type: DataType.ARRAY(DataType.STRING),
  })
  declare tags: string[];

}
