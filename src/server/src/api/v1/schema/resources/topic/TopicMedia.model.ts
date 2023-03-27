import { Table } from 'sequelize-typescript';

import { TopicMediaAttributes, TopicMediaCreationAttributes } from './TopicMedia.types';
import { Media } from '../Media.model';

@Table({
  modelName: 'topic_media',
  paranoid: true,
  timestamps: true,
})
export class TopicMedia<A extends TopicMediaAttributes = TopicMediaAttributes, B extends TopicMediaCreationAttributes = TopicMediaCreationAttributes> extends Media<A, B> implements TopicMediaAttributes {}