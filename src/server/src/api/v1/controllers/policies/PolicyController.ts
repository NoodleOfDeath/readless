import { Get, Route, Tags } from 'tsoa';
import { Policy, PolicyAttributes } from '../../schema/policy.model';

@Route('/v1/policies')
@Tags('Policies')
export class PolicyController {
  @Get('/privacy')
  public async getPrivacyPolicy(): Promise<PolicyAttributes> {
    return Policy.findOne({ where: { name: 'privacy' } });
  }

  @Get('/terms')
  public async getTermsOfService(): Promise<PolicyAttributes> {
    return Policy.findOne({ where: { name: 'terms' } });
  }
}
