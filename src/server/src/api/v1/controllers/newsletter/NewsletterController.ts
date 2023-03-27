import {
  Body,
  Post,
  Route,
  Tags,
} from 'tsoa';

import { Newsletter, Subscription } from '../../schema/models';
import { SubscriptionAttributes, SubscriptionCreationAttributes } from '../../schema/types';

@Route('/v1/newsletter')
@Tags('Newsletter')
export class NewsletterController {

  @Post('/subscribe')
  public static async subscribeToNewsletter(@Body() data: SubscriptionCreationAttributes): Promise<SubscriptionAttributes> {
    const {
      aliasType, alias, newsletterName, 
    } = data;
    if (newsletterName) {
      const newsletter = (await Newsletter.findOne({ where: { name: newsletterName } }))?.toJSON();
      if (newsletter) {
        data.newsletterId = newsletter.id;
      }
      delete data.newsletterName;
    }
    const existingSubs = await Subscription.findAll(({
      where: {
        alias,
        aliasType,
        newsletterId: data.newsletterId,
      },
    }));
    if (existingSubs.length > 0) {
      return existingSubs[0];
    }
    const subscription = new Subscription(data);
    await subscription.save();
    await subscription.reload();
    return subscription;
  }
  
  @Post('/unsubscribe')
  public static async unsubscribeFromNewsletter(@Body() data: SubscriptionCreationAttributes): Promise<void> {
    const {
      aliasType, alias, newsletterName, 
    } = data;
    if (newsletterName) {
      const newsletter = (await Newsletter.findOne({ where: { name: newsletterName } }))?.toJSON();
      if (newsletter) {
        data.newsletterId = newsletter.id;
      }
      delete data.newsletterName;
    }
    const existingSubs = await Subscription.findAll(({
      where: {
        alias,
        aliasType,
        newsletterId: data.newsletterId,
      },
    }));
    if (existingSubs) {
      for (const sub of existingSubs) {
        await sub.destroy();
      }
    }
  }
  
}
