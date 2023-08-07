import ms from 'ms';
import { Op } from 'sequelize';
import {
  Column,
  DataType,
  Index,
  Table,
} from 'sequelize-typescript';
import { v4 } from 'uuid';

import {
  SubscriptionAttributes,
  SubscriptionChannel,
  SubscriptionCreationAttributes,
  SubscriptionEvent,
} from './Subscription.types';
import { 
  FirebaseMessage,
  FirebaseService,
  MailService,
  MailServiceOptions,
} from '../../../../../services';
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

  @Index({  
    name: 'subscription_channel_uuid_event',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare channel: SubscriptionChannel;
    
  @Index({  
    name: 'subscription_channel_uuid_event',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare uuid: string;
    
  @Index({  
    name: 'subscription_channel_uuid_event',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare event: SubscriptionEvent;

  @Column({ type: DataType.STRING })
  declare repeats: string;

  @Column({ type: DataType.STRING })
  declare title?: string;

  @Column({ type: DataType.STRING })
  declare body?: string;

  @Column({ type: DataType.DATE })
  declare fireTime?: Date;
    
  @Column({
    allowNull: false,
    defaultValue: 'en',
    type: DataType.STRING,
  })
  declare locale?: string;
    
  @Index({  
    name: 'subscription_verification_code',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({ type: DataType.STRING })
  declare verificationCode?: string;
    
  @Index({  
    name: 'subscription_unsubscribe_token',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({ type: DataType.STRING })
  declare unsubscribeToken?: string;
    
  @Column({ type: DataType.DATE })
  declare verifiedAt?: Date;

  @Column({
    defaultValue: new Date(Date.now() + ms(process.env.TOKEN_TTL_LEVEL_1 || '30m')),
    type: DataType.DATE,
  })
  declare expiresAt?: Date;

  public static async subscribe({
    channel,
    uuid,
    event,
    repeats,
    title,
    body,
    fireTime,
    locale,
  }: SubscriptionCreationAttributes): Promise<Subscription> {
    const verificationCode = v4();
    const subscription = await Subscription.create({
      body,
      channel,
      event,
      fireTime,
      locale,
      repeats,
      title,
      uuid,
      verificationCode,
    });
    switch (subscription.channel) {
    case 'email':
      await new MailService().sendMailFromTemplate({
        text: `Please verify your subscription by clicking the following link: ${process.env.SSL ? 'https://' : 'http://'}${process.env.BASE_DOMAIN}/verify?t=${subscription.verificationCode}`,
        to: subscription.uuid,
      }, 'verifySubscription', {
        email: subscription.uuid, 
        verificationCode, 
      }); 
      break;
    case 'push':
    case 'fcm':
    case 'apns':
      subscription.set('verificationCode', null);
      subscription.set('unsubscribeToken', v4());
      subscription.set('verifiedAt', new Date());
      subscription.set('expiresAt', null);
      await subscription.save();
      break;
    default:
      throw new InternalError('invalid subscription channel');
    }
    return await this.scope('public').findByPk(subscription.id);
  }

  public static async verify({ verificationCode }: Pick<SubscriptionCreationAttributes, 'verificationCode'>): Promise<Subscription> {
    const subscription = await Subscription.findOne({ where: { verificationCode } });
    if (!subscription) {
      throw new InternalError('invalid subscription');
    }
    if (subscription.expiresAt && subscription.expiresAt.valueOf() < Date.now()) {
      throw new InternalError('subscription expired');
    }
    subscription.set('verificationCode', null);
    subscription.set('unsubscribeToken', v4());
    subscription.set('verifiedAt', new Date());
    subscription.set('expiresAt', null);
    await subscription.save();
    return await this.scope('public').findByPk(subscription.id);
  }
  
  public static async unsubscribe({ event, unsubscribeToken }: Pick<SubscriptionCreationAttributes, 'event' | 'unsubscribeToken'>): Promise<void> {
    const subscription = await Subscription.findOne({
      where: {
        event, 
        [Op.or]: [ 
          { unsubscribeToken }, 
          {
            channel: ['push', 'fcm', 'apns'], 
            uuid: unsubscribeToken, 
          },
        ], 
      },
    });
    if (!subscription) {
      throw new InternalError('invalid subscription');
    }
    await subscription.destroy();
  }

  public static async notify<T extends SubscriptionChannel>(
    event: string, 
    channel0: T,
    data: MailServiceOptions & { title?: string, body?: string }
  ): Promise<void> {
    const channel = channel0 === 'push' ? ['firebase', 'apns'] : channel0;
    const subscriptions = await Subscription.findAll({
      where: {
        channel, 
        event, 
        verifiedAt: { [Op.ne] : null }, 
      },
    });
    if (!subscriptions.length) {
      return;
    }
    console.log(`notifying ${subscriptions.length} subscribers`);
    const messages: FirebaseMessage[] = [];
    for (const subscription of subscriptions) {
      const unsub = `${process.env.SSL ? 'https://' : 'http://'}${process.env.BASE_DOMAIN}/unsubscribe?t=${subscription.unsubscribeToken}`;
      switch (channel0) {
      case 'email':
        await new MailService().sendMail({
          ...data,
          from: process.env.MAIL_REPLY_TO,
          html: `${data.html}<p><a href="${unsub}">Unsubscribe</a></p>`,
          to: subscription.uuid,
        });
        break;
      case 'push':
        messages.push({
          notification: {
            body: data.body,
            title: data.title,
          },
          token: subscription.uuid,
        });
        break;
      default:
        throw new InternalError('invalid subscription channel');
      }
    }
    if (messages.length > 0 && channel0 === 'push') {
      await FirebaseService.notify(messages);
    }
  }
  
}