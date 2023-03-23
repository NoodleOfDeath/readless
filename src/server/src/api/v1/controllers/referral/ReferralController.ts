import {
  Body,
  Post,
  Route,
  Tags,
} from 'tsoa';

import {
  Referral,
  ReferralAttributes,
  ReferralCreationAttributes,
} from '../../schema';

@Route('/v1/referral')
@Tags('Referral')
export class ReferralController {

  @Post('/')
  async recordReferral(@Body() data: ReferralCreationAttributes): Promise<ReferralAttributes> {
    try {
      const referral = new Referral(data);
      await referral.save();
      await referral.reload();
      return referral;
    } catch (e) {
      console.error(e);
    }
  }

}
