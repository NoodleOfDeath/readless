import { Table } from 'sequelize-typescript';

import {
  PollInteractionAttributes,
  PollInteractionCreationAttributes,
} from './PollInteraction.types';
import { Interaction } from '../interaction/Interaction.model';

@Table({
  modelName: 'poll_interaction',
  paranoid: true,
  timestamps: true,
})
export class PollInteraction<A extends PollInteractionAttributes = PollInteractionAttributes, B extends PollInteractionCreationAttributes = PollInteractionCreationAttributes> extends Interaction<A, B> implements PollInteractionAttributes {

}