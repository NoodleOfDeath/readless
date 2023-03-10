import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from './dated';
import { Source } from './source.model';
import { Media } from './media.model';

export type SourceMediaAttributes = DatedAttributes & {
  sourceId: number;
  mediaId: number;
};

export type SourceMediaCreationAttributes = DatedAttributes & {
  sourceId: number;
  mediaId: number;
};

@Table({
  modelName: 'source_media',
  timestamps: true,
  paranoid: true,
})
export class SourceMedia<A extends SourceMediaAttributes = SourceMediaAttributes, B extends SourceMediaCreationAttributes = SourceMediaCreationAttributes> extends Model<A, B> implements SourceMediaAttributes {
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<SourceMedia>): Partial<SourceMedia> {
    return defaults ?? {};
  }
    
  @ForeignKey(() => Source)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    sourceId: number;
  
  @ForeignKey(() => Media)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    mediaId: number;
    
  get source() {
    return Source.findByPk(this.sourceId);
  }
  
  get media() {
    return Media.findByPk(this.mediaId);
  }
    
}