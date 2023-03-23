import {
  Get,
  Route,
  Tags,
} from 'tsoa';

import { Policy, PolicyAttributes } from '../../schema';

@Route('/v1/policy')
@Tags('Policy')
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
