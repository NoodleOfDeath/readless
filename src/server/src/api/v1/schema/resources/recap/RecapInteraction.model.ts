import { Table } from 'sequelize-typescript';

import {
  RecapInteractionAttributes,
  RecapInteractionCreationAttributes,
} from './RecapInteraction.types';
import { Interaction } from '../interaction/Interaction.model';

@Table({
  modelName: 'recap_interaction',
  paranoid: true,
  timestamps: true,
})
export class RecapInteraction<A extends RecapInteractionAttributes = RecapInteractionAttributes, B extends RecapInteractionCreationAttributes = RecapInteractionCreationAttributes> extends Interaction<A, B> implements RecapInteractionAttributes {

}