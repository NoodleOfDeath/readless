import ms from 'ms';
import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { RecapPayload } from './../../../../../services/scribe/types';
import { RecapAttributes, RecapCreationAttributes } from './Recap.types';
import { Post } from '../Post.model';
import { PublicSentimentAttributes } from '../sentiment/Sentiment.types';
import { PublicSummaryAttributes } from '../summary/Summary.types';

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
  
  declare summaries?: PublicSummaryAttributes[];
  
  declare sentiment?: number;
  declare sentiments?: PublicSentimentAttributes[];
  
  public static objectKey({
    start: start0,
    end: end0,
    duration = '1d',
  }: RecapPayload = {}) {
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
      end,
      key,
      start,
    };
  }
  
  public static key(payload: RecapPayload = {}): RecapPayload {
    const {
      duration, end, key, start, 
    } = this.objectKey(payload);
    return {
      duration,
      end: end.toLocaleString(),
      key,
      start: start.toLocaleString(),
    };
  }
  
  public static async exists(payload: RecapPayload | string) {
    if (typeof payload === 'string') {
      return await Recap.findOne({ where: { key: payload } });
    }
    return await Recap.findOne({ where: { key: this.key(payload).key } });
  }

  public async formatAsHTML(summaries0: Partial<PublicSummaryAttributes>[] = [], baseUrl = process.env.BASE_DOMAIN) {
    const summaries = Object.fromEntries(summaries0.map((s) => [s.id, s]));
    const sources: string[] = [];
    const body = this.text.replace(/\[([\d,\s]+)\]/g, (_, $1) => {
      const ids = $1.replace(/\s/g, '').split(',').map(Number) as number[];
      if (ids.length === 0 || !ids.every((id) => id in summaries)) {
        return `[${$1}]`;
      }
      const links: string[] = [];
      ids.forEach((id) => {
        sources.push(`[${sources.length + 1}] <a href="https://open.${baseUrl}/s/${id}">${summaries[id].publisher.displayName}: ${summaries[id].title}</a>`);
        links.push(`<a href="https://open.${baseUrl}/s/${id}">${sources.length}</a>`);
      });
      return `[${links.join(', ')}]`;
    }).replace(/\n/g, '<br />');
    return `
    <html>
      <body>
        <p>
        ${body}
        </p>
        <hr />
        <p>
          ${sources.join('<br />')}
        </p>
      </body>
    </html>`;
  }

}
