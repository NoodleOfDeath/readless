import { Table } from 'sequelize-typescript';

import {
  SummaryInteractionAttributes,
  SummaryInteractionCreationAttributes,
} from './SummaryInteraction.types';
import { Interaction } from '../../interaction/Interaction.model';

@Table({
  modelName: 'summary_interaction',
  paranoid: true,
  timestamps: true,
})
export class SummaryInteraction<A extends SummaryInteractionAttributes = SummaryInteractionAttributes, B extends SummaryInteractionCreationAttributes = SummaryInteractionCreationAttributes> extends Interaction<A, B> implements SummaryInteractionAttributes {

}