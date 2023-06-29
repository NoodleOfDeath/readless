import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { RecapAttributes, RecapCreationAttributes } from './Recap.types';
import { PublicRecapSentimentAttributes } from './RecapSentiment.types';
import { Post } from '../Post.model';
import { PublicTranslationAttributes } from '../localization/Translation.types';
import { PublicSummaryAttributesConservative } from '../summary/Summary.types';

@Table({
  modelName: 'recap',
  paranoid: true,
  timestamps: true,
})
export class Recap extends Post<RecapAttributes, RecapCreationAttributes> implements RecapAttributes {
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare key: string;
  
  declare summaries?: PublicSummaryAttributesConservative[];
  
  declare sentiment?: number;
  declare sentiments?: PublicRecapSentimentAttributes[];
  
  declare translations?: PublicTranslationAttributes[];

}
