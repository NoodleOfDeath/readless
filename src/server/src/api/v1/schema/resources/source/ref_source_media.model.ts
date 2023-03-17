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
  timestamps: true,
  paranoid: true,
})
export class RefSourceMedia<A extends RefSourceMediaAttributes = RefSourceMediaAttributes, B extends RefSourceMediaCreationAttributes = RefSourceMediaCreationAttributes> extends Model<A, B> implements RefSourceMediaAttributes {

  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<RefSourceMedia>): Partial<RefSourceMedia> {
    return defaults ?? {};
  }
    
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    sourceId: number;
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    mediaId: number;
  
}