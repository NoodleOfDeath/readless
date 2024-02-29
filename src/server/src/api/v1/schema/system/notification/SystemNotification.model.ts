import { Table } from 'sequelize-typescript';

import {
  SystemNotificationAttributes,
  SystemNotificationCreationAttributes,
} from './SystemNotification.types';
import { Post } from '../../resources/Post.model';

@Table({
  modelName: 'system_notification',
  paranoid: true,
  timestamps: true,
})
export class SystemNotification extends Post<SystemNotificationAttributes, SystemNotificationCreationAttributes> implements SystemNotificationAttributes {

}
