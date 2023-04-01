import { Table } from 'sequelize-typescript';

import { SummaryContentAttributes, SummaryContentCreationAttributes } from './SummaryContent.types';
import { PostContent } from '../PostContent.model';

@Table({
  modelName: 'summary_content',
  paranoid: true,
  timestamps: true,
})
export class SummaryContent<A extends SummaryContentAttributes = SummaryContentAttributes, B extends SummaryContentCreationAttributes = SummaryContentCreationAttributes> extends PostContent<A, B> implements SummaryContentAttributes {

}