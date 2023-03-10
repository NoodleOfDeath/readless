import { Body, Post, Route, Tags } from 'tsoa';
import { Subscription, SubscriptionAttributes, SubscriptionCreationAttributes } from '../../schema';

@Route('/v1/newsletter')
@Tags('Newsletters')
export class NewsletterController {
  @Post('/subscribe')
  async subscribeToNewsletter(@Body() data: SubscriptionCreationAttributes): Promise<SubscriptionAttributes> {
    const subscription = new Subscription(data);
    await subscription.save();
    await subscription.reload();
    return subscription;
  }
}
