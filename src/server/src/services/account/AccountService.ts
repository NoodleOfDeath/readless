import { BaseService } from './../base';
import { UpdateCredentialRequest, UpdateCredentialResponse } from './types';
import { User } from '../../api/v1/schema';

export class AccountService extends BaseService {

  public async updateCredential(req: Partial<UpdateCredentialRequest>): Promise<UpdateCredentialResponse> {
    const { user } = await User.from(req);
    if (typeof req.password === 'string') {
      const password = await user.findCredential('password');
      if (password) {
        await password.destroy();
      }
      await user.createCredential('password', req.password);
      return { success: true };
    }
    return { success: false };
  }

}