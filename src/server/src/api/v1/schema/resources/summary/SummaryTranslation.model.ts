import { Table } from 'sequelize-typescript';

import {
  SummaryTranslationAttributes,
  SummaryTranslationCreationAttributes,
} from './SummaryTranslation.types';
import { Translation } from '../localization/Translation.model';

@Table({
  modelName: 'summary_translation',
  paranoid: true,
  timestamps: true,
})
export class SummaryTranslation<A extends SummaryTranslationAttributes = SummaryTranslationAttributes, B extends SummaryTranslationCreationAttributes = SummaryTranslationCreationAttributes> extends Translation<A, B> implements SummaryTranslationAttributes {

}