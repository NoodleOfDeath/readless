import {
  Body,
  Post,
  Route,
  Tags,
} from 'tsoa';

import {
  Metric,
  MetricAttributes,
  MetricCreationAttributes,
} from '../../schema';

@Route('/v1/metric')
@Tags('Metric')
export class MetricController {

  @Post('/')
  public static async recordMetric(@Body() data: MetricCreationAttributes): Promise<MetricAttributes> {
    return await Metric.create(data);
  }

}
