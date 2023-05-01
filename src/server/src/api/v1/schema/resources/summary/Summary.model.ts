import {
  AfterFind,
  Column,
  DataType,
  Scopes,
  Table,
} from 'sequelize-typescript';

import { 
  PUBLIC_SUMMARY_ATTRIBUTES,
  PUBLIC_SUMMARY_ATTRIBUTES_CONSERVATIVE,
  READING_FORMATS,
  Sentiment,
  SummaryAttributes,
  SummaryCreationAttributes,
} from './Summary.types';
import { SummaryInteraction } from './SummaryInteraction.model';
import { InteractionType } from '../../interaction/Interaction.types';
import { Post } from '../Post.model';
import { Outlet } from '../outlet/Outlet.model';
import { PublicOutletAttributes } from '../outlet/Outlet.types';
import { Category } from '../topic/Category.model';
import { PublicCategoryAttributes } from '../topic/Category.types';

@Scopes(() => ({ 
  conservative: { attributes: [...PUBLIC_SUMMARY_ATTRIBUTES_CONSERVATIVE] },
  public: { attributes: [...PUBLIC_SUMMARY_ATTRIBUTES] },
}))
@Table({
  modelName: 'summary',
  paranoid: true,
  timestamps: true,
})
export class Summary extends Post<SummaryInteraction, SummaryAttributes, SummaryCreationAttributes> implements SummaryAttributes {

  outletAttributes?: PublicOutletAttributes;
  categoryAttributes?: PublicCategoryAttributes;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare summary: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(1024),
  })
  declare shortSummary: string;

  @Column({
    defaultValue: [],
    type: DataType.ARRAY(DataType.STRING(1024)),
  })
  declare bullets: string[];
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare category: string;
  
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

  @Column({ 
    defaultValue: new Date(0),
    type: DataType.DATE,
  })
  declare originalDate: Date;

  @Column({ type: DataType.JSON })
  declare sentiments?: Record<string, Sentiment>;

  formats = Object.values(READING_FORMATS);
  
  async getInteractions(userId?: number, type?: InteractionType | InteractionType[]) {
    if (userId && type) {
      return await SummaryInteraction.findAll({
        where: {
          targetId: this.id, type, userId, 
        },
      });
    } else if (userId) {
      return await SummaryInteraction.findAll({ where: { targetId: this.id, userId } });
    }
    return await SummaryInteraction.findAll({ where: { targetId: this.id } });
  }
  
  async addUserInteractions(userId: number) {
    const uservotes = await this.getInteractions(userId, ['downvote', 'upvote']);
    const interactions = this.interactions;
    interactions.uservote = uservotes.some((v) => v.type === 'downvote') ? 'down' : uservotes.some((v) => v.type === 'upvote') ? 'up' : undefined;
    this.set('interactions', interactions, { raw: true });
  }

  @AfterFind
  static async addOutlet(cursor?: Summary | Summary[]) {
    if (!cursor) {
      return;
    }
    const summaries = Array.isArray(cursor) ? cursor : [cursor];
    const outletIds = summaries.map((summary) => {
      return summary.outletId;
    });
    const outlets = await Outlet.scope('public').findAll({ where: { id: outletIds } });
    summaries.forEach((summary) => {
      const outlet = outlets.find((o) => o.id === summary.outletId);
      summary.set('outletAttributes', outlet?.toJSON(), { raw: true });
    });
  }

  @AfterFind
  static async addCategory(cursor?: Summary | Summary[]) {
    if (!cursor) {
      return;
    }
    const summaries = Array.isArray(cursor) ? cursor : [cursor];
    const categoryNames = summaries.map((summary) => summary.category);
    const categories = await Category.scope('public').findAll({ where: { name: categoryNames } });
    summaries.forEach((summary) => {
      const category = categories.find((c) => c.name === summary.category);
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
      return summary.id;
    });
    const interactions = await SummaryInteraction.findAll({ where: { targetId: summaryIds } });
    for (const summary of summaries) {
      const interactionMap = {
        bookmark: [],
        comment: [],
        downvote: [],
        favorite: [],
        listen: [],
        read: [],
        share: [],
        upvote: [],
        view: [],
      };
      interactions.forEach((interaction) => {
        if (interaction.targetId === summary.id && interaction.type in interactionMap) {
          interactionMap[interaction.type].push(interaction);
        }
      });
      const summaryInteractions = {
        bookmark: interactionMap.bookmark.length,
        comment: interactionMap.comment.length,
        downvote: interactionMap.downvote.length,
        favorite: interactionMap.favorite.length,
        listen: interactionMap.listen.length,
        read: interactionMap.read.length,
        share: interactionMap.share.length,
        upvote: interactionMap.upvote.length,
        view: interactionMap.view.length + 1,
      };
      summary.set('interactions', summaryInteractions, { raw: true });
    }
    
  }

}
