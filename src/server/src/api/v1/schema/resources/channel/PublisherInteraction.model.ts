import { Table } from 'sequelize-typescript';

import {
  PublisherInteractionAttributes,
  PublisherInteractionCreationAttributes,
} from './PublisherInteraction.types';
import { Interaction } from '../interaction/Interaction.model';

@Table({
  modelName: 'publisher_interaction',
  paranoid: true,
  timestamps: true,
})
export class PublisherInteraction<A extends PublisherInteractionAttributes = PublisherInteractionAttributes, B extends PublisherInteractionCreationAttributes = PublisherInteractionCreationAttributes> extends Interaction<A, B> implements PublisherInteractionAttributes {

}