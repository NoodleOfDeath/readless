import { BaseService } from './../base';
import { MutateAccountRequest, MutateAccountResponse } from './types';
import { User } from '../../api/v1/schema';
import { AuthError } from '../auth';
import { JwtBearing } from '../auth/types';

export class AccountService extends BaseService {

  public async mutateAccount(req: Partial<JwtBearing<MutateAccountRequest>>): Promise<MutateAccountResponse> {
    const { user } = await User.from(req);
    if (typeof req.payload?.newPassword === 'string') {
      if (req.jwt && !req.jwt.can('write', 'account')) {
        throw new AuthError('INSUFFICIENT_PERMISSIONS');
      }
      const password = await user.findCredential('password');
      if (password) {
        await password.destroy();
      }
      await user.createCredential('password', req.payload.newPassword);
      return { success: true };
    }
    return { success: false };
  }

}