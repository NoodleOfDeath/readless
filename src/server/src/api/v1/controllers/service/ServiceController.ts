import {
  Get,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';
  
import { AuthError, InternalError } from '../../middleware';
import {
  BulkResponse,
  FindAndCountOptions,
  Service,
  ServiceAttributes,
} from '../../schema';

@Route('/v1/service')
@Tags('Service')
@Security('jwt')
@SuccessResponse(200, 'OK')
@SuccessResponse(201, 'Created')
@SuccessResponse(204, 'No Content')
@Response<AuthError>(401, 'Unauthorized')
@Response<InternalError>(500, 'Internal Error')
export class ServiceController {
  
  @Get('/')
  public static async getServices(): Promise<BulkResponse<ServiceAttributes>> {
    const options: FindAndCountOptions<Service> = { order: [['name', 'ASC']] };
    const services = await Service.scope('public').findAndCountAll(options);
    return services;
  }
  
}