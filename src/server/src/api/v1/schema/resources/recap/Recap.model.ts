import ms from 'ms';
import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { RecapPayload } from './../../../../../services/scribe/types';
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
  
  public static key({
    start: start0,
    end: end0,
    duration = '1d',
  }: RecapPayload = {}): RecapPayload {
    const start = !Number.isNaN(new Date(start0).valueOf()) ?
      new Date(start0) :
      typeof start0 === 'string' ?
        new Date(new Date(new Date().toDateString()).valueOf() + ms(start0)) :
        new Date(new Date().toDateString());
    if (Number.isNaN(start.valueOf())) {
      throw new Error('bad date');
    }
    const end = !Number.isNaN(new Date(end0).valueOf()) ?
      new Date(end0) :
      !Number.isNaN(new Date(duration).valueOf()) ?
        new Date(duration) :
        new Date(start.valueOf() + ms(duration) - 1000);
    const key = [
      start.toLocaleString(), 
      end.toLocaleString(),
      typeof duration === 'string' ? duration : undefined,
    ].filter(Boolean).join(' -- ');
    return {
      duration,
      end: end.toISOString(),
      key,
      start: start.toISOString(),
    };
  }
  
  public static async exists(payload: string | RecapPayload) {
    if (typeof payload === 'string') {
      return await Recap.findOne({ where: { key: payload } });
    }
    return await Recap.findOne({ where: { key: this.key(payload).key } });
  }

}
