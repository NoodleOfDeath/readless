import { Table } from 'sequelize-typescript';

import {
  EventInteractionAttributes,
  EventInteractionCreationAttributes,
} from './EventInteraction.types';
import { Interaction } from '../interaction/Interaction.model';

@Table({
  modelName: 'event_interaction',
  paranoid: true,
  timestamps: true,
})
export class EventInteraction<A extends EventInteractionAttributes = EventInteractionAttributes, B extends EventInteractionCreationAttributes = EventInteractionCreationAttributes> extends Interaction<A, B> implements EventInteractionAttributes {

}