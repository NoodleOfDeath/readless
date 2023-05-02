
export class BaseService {

  public static features: Record<string, unknown> = {};

  public static log(...args: unknown[]) {
    console.log(`[${new Date()}]`, ...args);
  }

}

try {
  const features = JSON.parse(process.env.ENABLED_FEATURES || '{}');
  BaseService.features = features;
} catch (e) {
  console.error('Failed to parse ENABLED_FEATURES');
  BaseService.features = {};
}