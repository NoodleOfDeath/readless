import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from '../dated';
import { Media } from '../media.model';
import { Source } from './source.model';

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
    
  async source() {
    return await Source.findByPk(this.sourceId);
  }
  
  async media() {
    return await Media.findByPk(this.mediaId);
  }
    
}