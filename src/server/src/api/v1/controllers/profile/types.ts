import { Profile } from '../../schema';
import { JwtRequest } from '../account';

export type ProfileRequest = JwtRequest;

export type ProfileResponse = {
  profile?: Profile;
};