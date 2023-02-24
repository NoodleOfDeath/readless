import { Body, Post, Route, Tags } from 'tsoa';
import { Referral, ReferralAttributes, ReferralCreationAttributes } from '../../../../schema/v1/models';

@Route('/v1/referrals')
@Tags('Referrals')
export class ReferralController {
  
  static async record(ref?: string, target?: string) {
    try {
      return new ReferralController().recordReferral(ref, target);
    } catch(e) {
      console.error(e);
    }
  }
  
  @Post('/')
  recordReferral(
    @Body() { ref, target }: { ref?: string, target?: string }
  ): Promise<ReferralAttributes> {
    try {
      if (!ref) { return }
      const data = JSON.parse(atob(ref)) as ReferralCreationAttributes;
      if (target) data.target = target;
      const referral = new Referral(data);
      await referral.save();
      await referral.reload();
      return referral;
    } catch(e) {
      console.error(e);
    }
  }
  
}