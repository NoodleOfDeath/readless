import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import {
  RefSourceInteractionAttributes,
  RefSourceInteractionCreationAttributes,
} from './ref_source_interaction.types';
import { BaseModel } from '../../base';

@Table({
  modelName: '_ref_source_interaction',
  paranoid: true,
  timestamps: true,
})
export class RefSourceInteraction<A extends RefSourceInteractionAttributes = RefSourceInteractionAttributes, B extends RefSourceInteractionCreationAttributes = RefSourceInteractionCreationAttributes> extends BaseModel<A, B> implements RefSourceInteractionAttributes {
    
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    sourceId: number;
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    interactionId: number;

}