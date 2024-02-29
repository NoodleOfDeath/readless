import { Table } from 'sequelize-typescript';

import { RecapMediaAttributes, RecapMediaCreationAttributes } from './RecapMedia.types';
import { Media } from '../media/Media.model';

@Table({
  modelName: 'recap_media',
  paranoid: true,
  timestamps: true,
})
export class RecapMedia<A extends RecapMediaAttributes = RecapMediaAttributes, B extends RecapMediaCreationAttributes = RecapMediaCreationAttributes> extends Media<A, B> implements RecapMediaAttributes {

}