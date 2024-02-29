import { Table } from 'sequelize-typescript';

import {
  CategoryInteractionAttributes,
  CategoryInteractionCreationAttributes,
} from './CategoryInteraction.types';
import { Interaction } from '../interaction/Interaction.model';

@Table({
  modelName: 'category_interaction',
  paranoid: true,
  timestamps: true,
})
export class CategoryInteraction<A extends CategoryInteractionAttributes = CategoryInteractionAttributes, B extends CategoryInteractionCreationAttributes = CategoryInteractionCreationAttributes> extends Interaction<A, B> implements CategoryInteractionAttributes {

}