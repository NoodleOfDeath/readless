import { Table } from 'sequelize-typescript';

import { DevUpdateAttributes, DevUpdateCreationAttributes } from './DevUpdate.types';
import { Post } from '../../resources/Post.model';

@Table({
  modelName: 'dev_update',
  paranoid: true,
  timestamps: true,
})
export class DevUpdate extends Post<DevUpdateAttributes, DevUpdateCreationAttributes> implements DevUpdateAttributes {

}
