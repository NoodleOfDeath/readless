import { QueryTypes } from 'sequelize';
import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { TopicAttributes, TopicCreationAttributes } from './Topic.types';
import { TopicSummary } from './TopicSummary.model';
import { QueryFactory } from '../../../';
import { Group } from '../../group/Group.model';
import { GroupType } from '../../group/Group.types';
import { Summary } from '../Summary.model';
import { SummaryAttributes } from '../Summary.types';

@Table({
  modelName: 'topic',
  timestamps: true,
})
export class Topic extends Group<TopicAttributes, TopicCreationAttributes> implements TopicAttributes {

  @Column({
    defaultValue: 'topic',
    type: DataType.STRING,
  })
  declare type: GroupType;

  static async topicOfChild(child: SummaryAttributes | number) {
    const childId = typeof child === 'number' ? child : child.id;
    const relation = await TopicSummary.findOne({ where: { childId } });
    return await Topic.findByPk(relation?.groupId);
  }
  
  static async resolveDuplicates() {
    const records = await this.sql.query(QueryFactory.getQuery('duplicate_topics'), {
      nest: true,
      type: QueryTypes.SELECT,
    }) as ({ siblings: number[] })[];
    for (const { siblings } of records) {
      const topic = await this.findByPk(siblings.shift());
      if (!topic) {
        continue;
      }
      for (const sibling of siblings) {
        const fromTopic = await this.findByPk(sibling);
        if (fromTopic) {
          await fromTopic.transferChildren(topic);
          await fromTopic.destroy();
        }
      }
    }
  }

  async addChildren(...children: SummaryAttributes[]) {
    for (const child of children) {
      const exists = await TopicSummary.findOne({ where: { childId: child.id, groupId: this.id } });
      if (!exists) {
        await TopicSummary.create({
          childId: child.id,
          groupId: this.id,
        });
      }
    }
  }
  
  async transferChildren(toTopic: Topic | number) {
    const toTopicId = typeof toTopic === 'number' ? toTopic : toTopic.id;
    console.log(`transferring children from ${this.id} to ${toTopicId}`);
    await TopicSummary.update(
      { groupId: toTopicId },
      { where: { groupId: this.id } }
    );
  }

  async getChildren() {
    const relations = await TopicSummary.findAll({ where: { groupId: this.id } });
    const children = await Promise.all(relations.map(async (relation) => await Summary.findByPk(relation.childId)));
    return children;
  }

}