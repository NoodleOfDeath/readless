import {
  Get, Path, Route, Tags, 
} from 'tsoa';

import { Feature, FeatureAttributes } from '../../schema/models';

@Route('/v1/features')
@Tags('Features')
export class FeatureController {

  @Get('/')
  async getFeatures(): Promise<FeatureAttributes[]> {
    return Feature.findAll();
  }
  
  @Get('/:feature')
  async getFeature(@Path() feature: string): Promise<FeatureAttributes> {
    return Feature.findOne({ where: { name: feature } });
  }
  
}
