import { Table } from 'sequelize-typescript';

import { RecapSentimentAttributes, RecapSentimentCreationAttributes } from './RecapSentiment.types';
import { Sentiment } from '../sentiment/Sentiment.model';

@Table({
  modelName: 'recap_sentiment',
  paranoid: true,
  timestamps: true,
})
export class RecapSentiment<
  A extends RecapSentimentAttributes = RecapSentimentAttributes, 
  B extends RecapSentimentCreationAttributes = RecapSentimentCreationAttributes>
  extends Sentiment<A, B> 
  implements RecapSentimentAttributes {

}