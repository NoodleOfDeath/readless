import {
  Body,
  Get,
  Post,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

import { 
  BulkResponse,
  LocalizeRequest,
  PendingJobResponse,
  TtsRequest,
} from '../';
import { GoogleService } from '../../../../services';
import { AuthError, InternalError } from '../../middleware';
import {
  FindAndCountOptions,
  Message,
  MessageAttributes,
  PublicSummaryAttributes,
  PublicSummaryTranslationAttributes,
  Service,
  ServiceAttributes,
  Summary,
  SummaryTranslation,
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

  @Get('/messages')
  public static async getSystemMessages(): Promise<BulkResponse<MessageAttributes>> {
    const options: FindAndCountOptions<Message> = { order: [['createdAt', 'DESC']] };
    const messages = await Message.scope('public').findAndCountAll(options);
    return messages;
  }
  
  @Post('/localize')
  public static async localize(
    @Body() req: LocalizeRequest
  ): Promise<BulkResponse<PublicSummaryTranslationAttributes>> {
    const {
      resourceId, resourceType, locale, 
    } = req;
    const languages = (await GoogleService.getLanguages()).map((language) => language.code);
    if (!languages.includes(locale)) {
      throw new InternalError('Invalid locale');
    }
    if (resourceType === 'summary') {
      const summary = await Summary.findByPk(resourceId);
      if (!summary) {
        throw new InternalError('Summary not found');
      }
      const translations = await SummaryTranslation.scope('public').findAndCountAll({ where: { locale, parentId: resourceId } });
      if (translations && translations.count >= 4) {
        return translations;
      } else {
        const attributes = ['title', 'shortSummary', 'summary', 'bullets'] as (keyof PublicSummaryAttributes)[];
        for (const attribute of attributes) {
          const property = summary[attribute];
          const translatedString = await GoogleService.translateText(Array.isArray(property) ? property.join('\n') : property, req.locale);
          await SummaryTranslation.upsert({
            attribute,
            locale: req.locale,
            parentId: resourceId,
            value: translatedString,
          });
        }
        return await SummaryTranslation.scope('public').findAndCountAll({ where: { locale, parentId: resourceId } });
      }
    } else {
      throw new InternalError('Invalid resource type');
    }
  }
  
  @Post('/tts')
  public static async tts(
    @Body() req: TtsRequest
  ): Promise<PendingJobResponse | string> {
    return '';
  }
  
}