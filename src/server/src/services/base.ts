import { SystemLog } from '../api/v1/schema';

export class BaseService {

  public static features: Record<string, unknown> = {};

  public static async error(message: string, throws = true): Promise<void> {
    console.error(message);
    await SystemLog.create({
      level: 'error',
      message,
    });
    if (throws === true) {
      throw new Error(message);
    }
  }
  
  public static async log(message: string, ...args: any[]): Promise<void> {
    console.log(`[${new Date()}]`, ...args);
    await SystemLog.create({
      level: 'info',
      message,
    });
  }

}

try {
  const features = JSON.parse(process.env.ENABLED_FEATURES || '{}');
  BaseService.features = features;
} catch (e) {
  console.error('Failed to parse ENABLED_FEATURES');
  BaseService.features = {};
}