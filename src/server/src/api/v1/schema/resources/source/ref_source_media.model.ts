import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { DatedAttributes } from '../../dated';

export type RefSourceMediaAttributes = DatedAttributes & {
  sourceId: number;
  mediaId: number;
};

export type RefSourceMediaCreationAttributes = DatedAttributes & {
  sourceId: number;
  mediaId: number;
};

@Table({
  modelName: '_ref_source_media',
  paranoid: true,
  timestamps: true,
})
export class RefSourceMedia<A extends RefSourceMediaAttributes = RefSourceMediaAttributes, B extends RefSourceMediaCreationAttributes = RefSourceMediaCreationAttributes> extends Model<A, B> implements RefSourceMediaAttributes {

  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<RefSourceMedia>): Partial<RefSourceMedia> {
    return defaults ?? {};
  }
    
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    sourceId: number;
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    mediaId: number;
  
}