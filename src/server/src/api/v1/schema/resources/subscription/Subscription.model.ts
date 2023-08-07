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
} from './Subscription.types';
import { 
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
    type: DataType.STRING,
    unique: true,
  })
  declare verificationCode?: string;
    
  @Column({
    type: DataType.STRING,
    unique: true,
  })
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
    locale,
  }: SubscriptionCreationAttributes): Promise<Subscription> {
    const verificationCode = v4();
    const subscription = await Subscription.create({
      channel,
      event,
      locale,
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
      subscription.set('unsubscribeToken', uuid);
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
  
  public static async unsubscribe({ unsubscribeToken }: Pick<SubscriptionCreationAttributes, 'unsubscribeToken'>): Promise<void> {
    const subscription = await Subscription.findOne({ where: { unsubscribeToken } });
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
    console.log(`notifying ${subscriptions.length} subscribers`);
    const tokens: string[] = [];
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
        tokens.push(subscription.uuid);
        break;
      default:
        throw new InternalError('invalid subscription channel');
      }
    }
    if (channel0 === 'push') {
      await FirebaseService.notify({
        notification: {
          body: data.body,
          title: data.title,
        },
        tokens,
      });
    }
  }
  
}