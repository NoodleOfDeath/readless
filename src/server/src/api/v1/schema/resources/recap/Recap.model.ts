import ms from 'ms';
import { Op } from 'sequelize';
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
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare length: string;
  
  declare summaries?: PublicSummaryAttributesConservative[];
  
  declare sentiment?: number;
  declare sentiments?: PublicRecapSentimentAttributes[];
  
  declare translations?: PublicTranslationAttributes[];
  
  public static key(
    date: string | Date = new Date().toDateString(),
    duration: string | Date = '1d'
  ) {
    const start = new Date(date);
    const end = typeof duration === 'string' ? 
      !Number.isNaN(new Date(duration).valueOf()) ?
        new Date(duration) :
        new Date(start.valueOf() + ms(duration) - 1000) : 
      duration;
    const key = [
      start.toLocaleString(), 
      end.toLocaleString(),
      typeof duration === 'string' ? duration : undefined,
    ].filter(Boolean).join(' -- ');
    return {
      end,
      key,
      start,
    };
  }
  
  public static async exists(
    date: string | Date = new Date().toDateString(), 
    duration: string | Date = '1d'
  ) {
    return await Recap.findOne({ where: { key: { [Op.or]: [typeof date === 'string' ? date : undefined, this.key(date, duration).key].filter(Boolean) } } });
  }

}
