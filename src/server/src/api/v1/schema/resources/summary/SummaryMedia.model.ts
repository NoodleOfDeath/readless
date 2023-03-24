import { Table } from 'sequelize-typescript';

import { SummaryMediaAttributes, SummaryMediaCreationAttributes } from './SummaryMedia.types';
import { Media } from '../Media.model';

@Table({
  modelName: 'summary_media',
  paranoid: true,
  timestamps: true,
})
export class SummaryMedia<A extends SummaryMediaAttributes = SummaryMediaAttributes, B extends SummaryMediaCreationAttributes = SummaryMediaCreationAttributes> extends Media<A, B> implements SummaryMediaAttributes {}