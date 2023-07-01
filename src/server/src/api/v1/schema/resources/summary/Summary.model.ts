import { Op } from 'sequelize';
import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { SummaryAttributes, SummaryCreationAttributes } from './Summary.types';
import { SummaryInteraction } from './SummaryInteraction.model';
import { SummaryRelation } from './SummaryRelation.model';
import { SummarySentiment } from './SummarySentiment.model';
import { PublicSummarySentimentAttributes } from './SummarySentiment.types';
import { Post } from '../Post.model';
import { Category } from '../channel/Category.model';
import { PublicCategoryAttributes } from '../channel/Category.types';
import { Outlet } from '../channel/Outlet.model';
import { PublicOutletAttributes } from '../channel/Outlet.types';
import { InteractionType } from '../interaction/Interaction.types';
import { PublicTranslationAttributes } from '../localization/Translation.types';

@Table({
  modelName: 'summary',
  paranoid: true,
  timestamps: true,
})
export class Summary extends Post<SummaryAttributes, SummaryCreationAttributes> implements SummaryAttributes {
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare outletId: number;
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare categoryId: number;

  @Column({ type: DataType.INTEGER })
  declare subcategoryId?: number;

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

  declare outlet: PublicOutletAttributes;
  declare category: PublicCategoryAttributes;
  declare subcategory?: PublicCategoryAttributes;

  declare sentiment?: number;
  declare sentiments?: PublicSummarySentimentAttributes[];

  declare translations?: PublicTranslationAttributes[];

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
  
  async getSentiments() {
    return await SummarySentiment.findAll({ where: { parentId: this.id } });
  }
  
  async getOutlet() {
    return await Outlet.findByPk(this.outletId);
  }
  
  async getCategory() {
    return await Category.findByPk(this.categoryId);
  }
  
  async getSiblings<
    Deep extends boolean = false,
    R extends Deep extends true ? Summary[] : number[] = Deep extends true ? Summary[] : number[]
  >(deep?: Deep): Promise<R> {
    const siblings = (await SummaryRelation.findAll({ where: { parentId: this.id } })).map((r) => r.siblingId);
    if (deep) {
      return await Promise.all(siblings.map(async (r) => await Summary.findByPk(r))) as R;
    }
    return siblings as R;
  }
  
  async dropAllSiblings() {
    await SummaryRelation.destroy({
      where: {
        [Op.or]: [
          { parentId: this.id },
          { siblingId: this.id },
        ],
      },
    });
  }
  
  async associateWith(sibling: number | SummaryAttributes, recurse = true) {
    const id = typeof sibling === 'number' ? sibling : sibling.id;
    if (recurse) {
      const relations = await SummaryRelation.findAll({
        where: { 
          [Op.or]: [
            { parentId: [this.id, id] },
          ],
        },
      });
      for (const relation of relations) {
        if (relation.siblingId === this.id || relation.siblingId === id) {
          continue;
        }
        const siblingSummary = await Summary.scope('public').findByPk(relation.siblingId);
        await siblingSummary.associateWith(id, false);
        await siblingSummary.associateWith(this.id, false);
      }
    }
    await SummaryRelation.findOrCreate({
      where: {
        parentId: this.id,
        siblingId: id,
      },
    });
    await SummaryRelation.findOrCreate({
      where: {
        parentId: id,
        siblingId: this.id,
      },
    });
  }

}
