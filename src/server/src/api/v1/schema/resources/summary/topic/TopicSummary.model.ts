import { Table } from 'sequelize-typescript';

import { TopicSummaryAttributes, TopicSummaryCreationAttributes } from './TopicSummary.types';
import { GroupMembership } from '../../group/GroupMembership.model';

@Table({
  modelName: 'topic_summary',
  timestamps: true,
})
export class TopicSummary extends GroupMembership<TopicSummaryAttributes, TopicSummaryCreationAttributes> implements TopicSummaryAttributes {
}