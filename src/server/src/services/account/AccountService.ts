import { BaseService } from './../base';
import { MutateAccountRequest, MutateAccountResponse } from './types';
import { User } from '../../api/v1/schema';
import { AuthError } from '../auth';

export class AccountService extends BaseService {

  public async mutateAccount(req: Partial<MutateAccountRequest>): Promise<MutateAccountResponse> {
    const { jwt, user } = await User.from(req);
    if (!jwt) {
      throw new AuthError('INVALID_CREDENTIALS');
    }
    if (typeof req.payload.newPassword === 'string') {
      if (!jwt.can('write', 'account')) {
        throw new AuthError('INSUFFICIENT_PERMISSIONS');
      }
      const password = await user.findCredential('password');
      if (!password) {
        throw new AuthError('INVALID_CREDENTIALS');
      }
      await password.destroy();
      await user.createCredential('password', req.payload.newPassword);
    }
    return { success: true };
  }

}