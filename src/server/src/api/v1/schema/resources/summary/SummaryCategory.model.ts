import { Table } from 'sequelize-typescript';

import {
  SummaryCategoryAttributes,
  SummaryCategoryCreationAttributes,
} from './SummaryCategory.types';
import { Categorizable } from '../channel/Categorizable.model';

@Table({
  modelName: 'summary_category',
  paranoid: true,
  timestamps: true,
})
export class SummaryCategory<A extends SummaryCategoryAttributes = SummaryCategoryAttributes, B extends SummaryCategoryCreationAttributes = SummaryCategoryCreationAttributes> extends Categorizable<A, B> implements SummaryCategoryAttributes {

}