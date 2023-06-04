import axios from 'axios';

import { S3Service } from '../aws';

type GenerateTtsOptions = {
  text: string;
  voice?: string;
  quality?: string;
  output_format?: 'mp3' | 'wav' | 'ogg' | 'flac';
  speed?: number;
  sample_rate?: number;
  seed?: number;
};

type GenerateTtsResult = {
  id: string;
  url: string;
  duration?: number;
  size?: number;
};

export class TtsService extends S3Service {
  
  public static baseUrl = 'https://play.ht/api/v2';
  
  public static api(ep: string) {
    return `${this.baseUrl}/${ep}`;
  }
  
  public static async get(ep: string) {
    return await axios.get(
      this.api(ep), 
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${process.env.PLAY_HT_SECRET_KEY}`,
          'Content-Type': 'application/json',
          'X-User-Id': process.env.PLAY_HT_USER_ID,
        },
      }
    );
  }
  
  public static async post(ep: string, data: FormData) {
    return await axios.post(
      this.api(ep), 
      data,
      {
        headers: {
          Accept: 'text/event-stream',
          Authorization: `Bearer ${process.env.PLAY_HT_SECRET_KEY}`,
          'Content-Type': 'application/json',
          'X-User-Id': process.env.PLAY_HT_USER_ID,
        },
        responseType: 'stream',
      }
    );
  }
  
  public static async getVoices() {
    return await this.get('voices');
  }
  
  public static generate({
    text,
    voice = 'charlotte',
    quality = 'high',
    output_format = 'mp3',
    speed = 1,
    sample_rate = 44100,
    seed = 0,
  }: GenerateTtsOptions) {
    
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<GenerateTtsResult>(async (resolve, reject) => {
      
      try {
        const data = new FormData();
        data.append('text', text);
        data.append('voice', voice);
        data.append('quality', quality);
        data.append('output_format', output_format);
        data.append('speed', speed.toString());
        data.append('sample_rate', sample_rate.toString());
        data.append('seed', seed.toString());
        
        const response = await this.post('tts', data);
        const stream = response.data;
        const buffer: string[] = [];
        
        stream.on('data', (data: string) => {
          buffer.push(data);
        });
        
        stream.on('end', () => {
          const text = buffer.join('');
          const match = text.match(/event:[\s\t]*completed[\n\s\t]*data:[\s\t]*(\{.*\})/);
          if (match) {
            const json = JSON.parse(match[1]) as GenerateTtsResult;
            resolve(json);
            return;
          }
          reject(new Error('Unknown error'));
        });
        
      } catch (e) {
        console.error(e);
        reject(e);
      }
      
    });
    
  }
  
}