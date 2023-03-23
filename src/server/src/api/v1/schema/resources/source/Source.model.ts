import {
  AfterFind,
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { SourceAttributes, SourceCreationAttributes } from './Source.types';
import { SourceInteraction } from './SourceInteraction.model';
import { TitledCategorizedPost } from '../Post.model';
import { Outlet } from '../outlet/Outlet.model';

@Table({
  modelName: 'source',
  paranoid: true,
  timestamps: true,
})
export class Source extends TitledCategorizedPost<SourceAttributes, SourceCreationAttributes> implements SourceAttributes {
  
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
  static async addOutletName(cursor?: Source | Source[]) {
    if (!cursor) {
      return;
    }
    const sources = Array.isArray(cursor) ? cursor : [cursor];
    const outletIds = sources.map((source) => {
      return source.toJSON().outletId;
    });
    const outlets = await Outlet.findAll({ where: { id: outletIds } });
    sources.forEach((source) => {
      const outlet = outlets.find((o) => o.id === source.toJSON().outletId);
      source.set('outletName', outlet?.toJSON().displayName ?? '', { raw: true });
    });
  }

  @AfterFind
  static async addInteractions(cursor?: Source | Source[]) {
    if (!cursor) {
      return;
    }
    const sources = Array.isArray(cursor) ? cursor : [cursor];
    const sourceIds = sources.map((source) => {
      return source.toJSON().id;
    });
    const interactions = await SourceInteraction.findAll({ where: { targetId: sourceIds } });
    sources.forEach((source) => {
      const newInteractionMap = {
        bookmark: [],
        comment: [],
        impression: [],
        like: [],
        share: [],
        view: [],
      };
      interactions.forEach((interaction) => {
        const interactionJson = interaction.toJSON();
        if (interactionJson.targetId === source.id) {
          newInteractionMap[interactionJson.type].push(interactionJson);
        }
      });
      source.set('interactions', newInteractionMap, { raw: true });
    });
    
  }

}
