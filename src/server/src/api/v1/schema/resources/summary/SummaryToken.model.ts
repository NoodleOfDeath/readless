import { Table } from 'sequelize-typescript';

import { SummaryTokenAttributes, SummaryTokenCreationAttributes } from './SummaryToken.types';
import { Token } from '../nlp/Token.model';

@Table({
  modelName: 'summary_token',
  paranoid: true,
  timestamps: true,
})
export class SummaryToken<A extends SummaryTokenAttributes = SummaryTokenAttributes, B extends SummaryTokenCreationAttributes = SummaryTokenCreationAttributes> extends Token<A, B> implements SummaryTokenAttributes {

}