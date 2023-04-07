import {
  AfterFind,
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { SummaryAttributes, SummaryCreationAttributes } from './Summary.types';
import { SummaryInteraction } from './SummaryInteraction.model';
import { InteractionType } from '../../interaction/Interaction.types';
import { TitledCategorizedPost } from '../Post.model';
import { Outlet } from '../outlet/Outlet.model';
import { Category } from '../topic/Category.model';
import { CategoryAttributes } from '../topic/Category.types';

@Table({
  modelName: 'summary',
  paranoid: true,
  timestamps: true,
})
export class Summary extends TitledCategorizedPost<SummaryInteraction, SummaryAttributes, SummaryCreationAttributes> implements SummaryAttributes {
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare outletId: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(2083),
    unique: true,
  })
  declare url: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare rawText: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare filteredText: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(1024),
  })
  declare originalTitle: string;

  outletName: string;
  categoryAttributes?: CategoryAttributes;
  
  async getInteractions(userId?: number, type?: InteractionType | InteractionType[]) {
    if (userId && type) {
      return await SummaryInteraction.findAll({
        where: {
          targetId: this.toJSON().id, type, userId, 
        },
      });
    } else if (userId) {
      return await SummaryInteraction.findAll({ where: { targetId: this.toJSON().id, userId } });
    }
    return await SummaryInteraction.findAll({ where: { targetId: this.toJSON().id } });
  }
  
  async addUserInteractions(userId: number) {
    const uservotes = await this.getInteractions(userId, ['downvote', 'upvote']);
    const interactions = this.toJSON().interactions;
    interactions.uservote = uservotes.some((v) => v.toJSON().type === 'downvote') ? 'down' : uservotes.some((v) => v.toJSON().type === 'upvote') ? 'up' : undefined;
    this.set('interactions', interactions, { raw: true });
  }

  @AfterFind
  static async addOutletName(cursor?: Summary | Summary[]) {
    if (!cursor) {
      return;
    }
    const summaries = Array.isArray(cursor) ? cursor : [cursor];
    const outletIds = summaries.map((summary) => {
      return summary.toJSON().outletId;
    });
    const outlets = await Outlet.findAll({ where: { id: outletIds } });
    summaries.forEach((summary) => {
      const outlet = outlets.find((o) => o.id === summary.toJSON().outletId);
      summary.set('outletName', outlet?.toJSON().displayName ?? '', { raw: true });
    });
  }

  @AfterFind
  static async addCategory(cursor?: Summary | Summary[]) {
    if (!cursor) {
      return;
    }
    const summaries = Array.isArray(cursor) ? cursor : [cursor];
    const categoryNames = summaries.map((summary) => {
      return summary.toJSON().category;
    });
    const categories = await Category.findAll({ where: { name: categoryNames } });
    summaries.forEach((summary) => {
      const category = categories.find((c) => c.name === summary.toJSON().category);
      summary.set('categoryAttributes', category?.toJSON(), { raw: true });
    });
  }

  @AfterFind
  static async addInteractions(cursor?: Summary | Summary[]) {
    if (!cursor) {
      return;
    }
    const summaries = Array.isArray(cursor) ? cursor : [cursor];
    const summaryIds = summaries.map((summary) => {
      return summary.toJSON().id;
    });
    const interactions = await SummaryInteraction.findAll({ where: { targetId: summaryIds } });
    summaries.forEach((summary) => {
      const interactionMap = {
        bookmark: [],
        comment: [],
        downvote: [],
        impression: [],
        share: [],
        upvote: [],
        view: [],
      };
      interactions.forEach((interaction) => {
        const interactionJson = interaction.toJSON();
        if (interactionJson.targetId === summary.id) {
          interactionMap[interactionJson.type].push(interactionJson);
        }
      });
      const summaryInteractions = {
        bookmark: interactionMap.bookmark.length,
        comment: interactionMap.comment.length,
        downvote: interactionMap.downvote.length,
        impression: interactionMap.impression.length,
        share: interactionMap.share.length,
        upvote: interactionMap.upvote.length,
        view: interactionMap.view.length,
      };
      summary.set('interactions', summaryInteractions, { raw: true });
    });
    
  }

}
