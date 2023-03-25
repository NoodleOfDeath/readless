import {
  AfterFind,
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { SummaryAttributes, SummaryCreationAttributes } from './Summary.types';
import { SummaryInteraction } from './SummaryInteraction.model';
import { TitledCategorizedPost } from '../Post.model';
import { Outlet } from '../outlet/Outlet.model';

@Table({
  modelName: 'summary',
  paranoid: true,
  timestamps: true,
})
export class Summary extends TitledCategorizedPost<SummaryAttributes, SummaryCreationAttributes> implements SummaryAttributes {
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    outletId: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(2083),
    unique: true,
  })
    url: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
    rawText: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
    filteredText: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(1024),
  })
    originalTitle: string;

  outletName: string;

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
      summary.set('interactions', {
        bookmark: interactionMap.bookmark.length,
        comment: interactionMap.comment.length,
        downvote: interactionMap.downvote.length,
        impression: interactionMap.impression.length,
        share: interactionMap.share.length,
        upvote: interactionMap.upvote.length,
        view: interactionMap.view.length,
      });
    });
    
  }

}
