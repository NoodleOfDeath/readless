import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from '../dated';
import { Media } from '../media.model';
import { Outlet } from './outlet.model';

export type OutletMediaAttributes = DatedAttributes & {
  outletId: number;
  mediaId: number;
};

export type OutletMediaCreationAttributes = DatedAttributes & {
  outletId: number;
  mediaId: number;
};

@Table({
  modelName: 'outlet_media',
  timestamps: true,
  paranoid: true,
})
export class OutletMedia<A extends OutletMediaAttributes = OutletMediaAttributes, B extends OutletMediaCreationAttributes = OutletMediaCreationAttributes> extends Model<A, B> implements OutletMediaAttributes {
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<OutletMedia>): Partial<OutletMedia> {
    return defaults ?? {};
  }
    
  @ForeignKey(() => Outlet)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    outletId: number;
  
  @ForeignKey(() => Media)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    mediaId: number;
    
  async outlet() {
    return await Outlet.findByPk(this.outletId);
  }
  
  async media() {
    return await Media.findByPk(this.mediaId);
  }
    
}