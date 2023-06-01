import { Op } from 'sequelize';
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
  TtsRequest,
} from '../';
import { 
  GoogleService, 
  IapService,
  TtsService,
} from '../../../../services';
import { AuthError, InternalError } from '../../middleware';
import {
  FindAndCountOptions,
  Message,
  MessageAttributes,
  PublicSummaryAttributes,
  PublicSummaryMediaAttributes,
  PublicSummaryTranslationAttributes,
  Service,
  ServiceAttributes,
  Summary,
  SummaryMedia,
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
      if (translations.count >= 4) {
        return translations;
      } else {
        const attributes = ['title', 'shortSummary', 'summary', 'bullets'] as (keyof PublicSummaryAttributes)[];
        for (const attribute of attributes) {
          const property = summary[attribute];
          const translatedString = await GoogleService.translateText(Array.isArray(property) ? property.join('\n') : property, req.locale);
          await SummaryTranslation.upsert({
            attribute,
            locale,
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
  ): Promise<BulkResponse<PublicSummaryMediaAttributes>> {
    const { 
      resourceType, 
      resourceId,
      voice = 'charlotte',
    } = req;
    const subscribed = await IapService.authorizePaywallAccess();
    if (!subscribed) {
      throw new AuthError('UNAUTHORIZED');
    }
    if (resourceType === 'summary') {

      const summary = await Summary.findByPk(resourceId);
      if (!summary) {
        throw new InternalError('Summary not found');
      }

      const media = await SummaryMedia.scope('public').findAndCountAll({ where: { parentId: resourceId } });
      if (media.count > 0) {
        return media;
      }
      
      const result = await TtsService.generate({
        text: summary.title,
        voice,
      });
      const obj = await TtsService.mirror(result.url, {
        ContentType: 'audio/mpeg',
        Folder: 'audio/s',
      });

      await SummaryMedia.upsert({
        key: 'tts',
        parentId: resourceId,
        type: 'audio',
        url: obj.url,
      });

      return await SummaryMedia.findAndCountAll({ 
        where: {
          key: { [Op.iLike]: 'tts%' },
          parentId: resourceId, 
          type: 'audio',
        },
      });

    } else {
      throw new InternalError('Invalid resource type');
    }
  }
  
}