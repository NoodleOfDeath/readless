import { Op } from 'sequelize';
import {
  Column,
  DataType,
  Index,
  Table,
} from 'sequelize-typescript';

import {
  SubscriptionAttributes,
  SubscriptionChannel,
  SubscriptionCreationAttributes,
} from './Subscription.types';
import { MailService, MailServiceOptions } from '../../../../../services';
import { InternalError } from '../../../middleware';
import { BaseModel } from '../../base';

@Table({
  modelName: 'subscription',
  paranoid: true,
  timestamps: true,
})
export class Subscription<
    A extends SubscriptionAttributes = SubscriptionAttributes,
    B extends SubscriptionCreationAttributes = SubscriptionCreationAttributes,
  > extends BaseModel<A, B> implements SubscriptionAttributes {

  verifyToken: string;

  @Index({  
    name: 'subscription_channel_uuid_event',
    unique: true,
  })
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare channel: SubscriptionChannel;
    
  @Index({  
    name: 'subscription_channel_uuid_event',
    unique: true,
  })
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare uuid: string;
    
  @Index({  
    name: 'subscription_channel_uuid_event',
    unique: true,
  })
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare event: string;
    
  @Column({
    allowNull: false,
    defaultValue: 'en',
    type: DataType.STRING,
  })
  declare locale?: string;
    
  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare verifiedToken?: string;
    
  @Column({ type: DataType.DATE })
  declare verifiedAt?: Date;

  public static async verify(
    channel: SubscriptionChannel,
    uuid: string,
    event: string,
    verifyToken: string
  ): Promise<Subscription> {
    const subscription = await Subscription.findOne({
      where: {
        channel,
        event,
        uuid,
        verifyToken,
      },
    });
    if (!subscription) {
      throw new InternalError('invalid subscription');
    }
    subscription.set('verifiedAt', new Date());
    await subscription.save();
    return subscription;
  }

  public static async notify<
    T extends SubscriptionChannel, 
    D extends T extends 'email' ? MailServiceOptions : never
  >(
    event: string, 
    channel: T,
    data: D
  ): Promise<void> {
    const subscriptions = await Subscription.findAll({
      where: {
        channel, 
        event, 
        verifiedAt: { [Op.ne] : null }, 
      },
    });
    console.log(`notifying ${subscriptions.length} subscribers`);
    for (const subscription of subscriptions) {
      switch (subscription.channel) {
      case 'email':
        await new MailService().sendMail({
          ...data,
          from: 'Read Less <thecakeisalie@readless.ai>',
          to: subscription.uuid,
        });
        break;
      default:
        throw new InternalError('invalid subscription channel');
      }
    }
  }
  
}