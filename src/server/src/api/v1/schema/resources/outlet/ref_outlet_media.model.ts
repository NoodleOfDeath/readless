import {
  Column, DataType, Model, Table 
} from 'sequelize-typescript';

import { DatedAttributes } from '../../dated';

export type RefOutletMediaAttributes = DatedAttributes & {
  outletId: number;
  mediaId: number;
};

export type RefOutletMediaCreationAttributes = DatedAttributes & {
  outletId: number;
  mediaId: number;
};

@Table({
  modelName: '_ref_outlet_media',
  timestamps: true,
  paranoid: true,
})
export class RefOutletMedia<A extends RefOutletMediaAttributes = RefOutletMediaAttributes, B extends RefOutletMediaCreationAttributes = RefOutletMediaCreationAttributes> extends Model<A, B> implements RefOutletMediaAttributes {
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<RefOutletMedia>): Partial<RefOutletMedia> {
    return defaults ?? {};
  }
    
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    outletId: number;
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    mediaId: number;
    
}