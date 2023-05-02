import { Resemble } from '@resemble/node';
import { AsyncClipInput } from '@resemble/node/dist/v2/clips';

import { BaseService } from '../base';

Resemble.setApiKey(process.env.RESEMBLE_API_TOKEN);

export class TtsService extends BaseService {
  
  public static async getVoices(page = 1, pageSize = 10) {
    return await Resemble.v2.voices.all(page, pageSize);
  }
  
  public static async getVoice(
    uuid: string 
  ) {
    return await Resemble.v2.voices.get(uuid);
  }
  
  public static async createClip(
    clip: AsyncClipInput,
    projectUuid = process.env.RESEMBLE_DEFAULT_PROJECT_UUID
  ) {
    return await Resemble.v2.clips.createAsync(projectUuid, clip);
  }
  
  public static async getClip(
    uuid: string,
    projectUuid = process.env.RESEMBLE_DEFAULT_PROJECT_UUID
  ) {
    return await Resemble.v2.clips.get(projectUuid, uuid);
  }
  
}