import { Table } from 'sequelize-typescript';

import {
  PublisherTranslationAttributes,
  PublisherTranslationCreationAttributes,
} from './PublisherTranslation.types';
import { Translation } from '../localization/Translation.model';

@Table({
  modelName: 'publisher_translation',
  paranoid: true,
  timestamps: true,
})
export class PublisherTranslation<A extends PublisherTranslationAttributes = PublisherTranslationAttributes, B extends PublisherTranslationCreationAttributes = PublisherTranslationCreationAttributes> extends Translation<A, B> implements PublisherTranslationAttributes {

}