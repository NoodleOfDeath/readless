import { Table } from 'sequelize-typescript';

import {
  SourceInteractionAttributes,
  SourceInteractionCreationAttributes,
} from './SourceInteraction.types';
import { Interaction } from '../../interaction/Interaction.model';

@Table({
  modelName: 'source_interaction',
  paranoid: true,
  timestamps: true,
})
export class SourceInteraction<A extends SourceInteractionAttributes = SourceInteractionAttributes, B extends SourceInteractionCreationAttributes = SourceInteractionCreationAttributes> extends Interaction<A, B> implements SourceInteractionAttributes {

}