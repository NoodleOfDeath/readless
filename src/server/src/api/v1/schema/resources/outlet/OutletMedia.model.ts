import { Table } from 'sequelize-typescript';

import { OutletMediaAttributes, OutletMediaCreationAttributes } from './OutletMedia.types';
import { Media } from '../Media.model';

@Table({
  modelName: 'outlet_media',
  paranoid: true,
  timestamps: true,
})
export class OutletMedia<A extends OutletMediaAttributes = OutletMediaAttributes, B extends OutletMediaCreationAttributes = OutletMediaCreationAttributes> extends Media<A, B> implements OutletMediaAttributes {}