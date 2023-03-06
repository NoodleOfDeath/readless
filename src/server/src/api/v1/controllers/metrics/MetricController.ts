import { Body, Post, Route, Tags } from 'tsoa';

import { Metric, MetricAttributes, MetricCreationAttributes } from '../../schema';

@Route('/v1/metrics')
@Tags('Metricss')
export class MetricController {
  @Post('/')
  async recordMetric(@Body() data: MetricCreationAttributes): Promise<MetricAttributes> {
    try {
      const metric = new Metric(data);
      await metric.save();
      await metric.reload();
      return metric;
    } catch (e) {
      console.error(e);
    }
  }
}
