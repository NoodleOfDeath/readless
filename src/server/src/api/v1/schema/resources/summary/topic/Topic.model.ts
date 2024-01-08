import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { TopicAttributes, TopicCreationAttributes } from './Topic.types';
import { TopicSummary } from './TopicSummary.model';
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

  async getChildren() {
    const relations = await TopicSummary.findAll({ where: { groupId: this.id } });
    const children = await Promise.all(relations.map(async (relation) => await Summary.findByPk(relation.childId)));
    return children;
  }

}