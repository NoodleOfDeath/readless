import { Table } from 'sequelize-typescript';

import {
  SummaryInteractionMediaAttributes,
  SummaryInteractionMediaCreationAttributes,
} from './SummaryInteractionMedia.types';
import { Media } from '../Media.model';

@Table({
  modelName: 'summary_interaction_media',
  paranoid: true,
  timestamps: true,
})
export class SummaryInteractionMedia<A extends SummaryInteractionMediaAttributes = SummaryInteractionMediaAttributes, B extends SummaryInteractionMediaCreationAttributes = SummaryInteractionMediaCreationAttributes> extends Media<A, B> implements SummaryInteractionMediaAttributes {}