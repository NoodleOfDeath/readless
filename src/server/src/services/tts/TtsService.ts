import axios from 'axios';

import { BaseService } from '../base';

type GenerateTtsOptions = {
  text: string;
  voice: string;
};

export class TtsService extends BaseService {
  
  public static baseUrl = 'https://play.ht/api/v2';
  
  public static api(ep: string) {
    return `${this.baseUrl}/${ep}`;
  }
  
  public static generate({
    text,
    voice,
  }: GenerateTtsOptions) {
    
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<string[]>(async (resolve, reject) => {
      
      try {
        const data = new FormData();
        data.append('text', text);
        data.append('voice', voice);
        
        const response = await axios.post(
          this.api('tts'), 
          data,
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${process.env.PLAY_HT_SECRET_KEY}`,
              'Content-Type': 'application/json',
              'X-User-Id': process.env.PLAY_HT_USER_ID,
            },
            responseType: 'stream',
          }
        );
          
        const stream = response.data;
        const buffer: string[] = [];
        
        stream.on('data', (data) => {
          console.log(data);
          buffer.push(data as string);
        });
        
        stream.on('end', () => {
          resolve(buffer);
        });
        
      } catch (e) {
        reject(e);
      }
      
    });
    
  }
  
}