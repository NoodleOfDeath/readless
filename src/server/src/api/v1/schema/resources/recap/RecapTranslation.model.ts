import { Table } from 'sequelize-typescript';

import {
  RecapTranslationAttributes,
  RecapTranslationCreationAttributes,
} from './RecapTranslation.types';
import { Translation } from '../localization/Translation.model';

@Table({
  modelName: 'recap_translation',
  paranoid: true,
  timestamps: true,
})
export class RecapTranslation<A extends RecapTranslationAttributes = RecapTranslationAttributes, B extends RecapTranslationCreationAttributes = RecapTranslationCreationAttributes> extends Translation<A, B> implements RecapTranslationAttributes {

}