import fs from 'fs';

import { Request as ExpressRequest } from 'express';
import {
  Body,
  Get,
  Path,
  Post,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

import { 
  BulkResponse,
  LocalizeRequest,
} from '../';
import { 
  GoogleService,
  IapService,
  PurchaseRequest,
  S3Service,
} from '../../../../services';
import { AuthError, InternalError } from '../../middleware';
import {
  FindAndCountOptions,
  Message,
  MessageAttributes,
  PublicSummaryAttributes,
  PublicSummaryTranslationAttributes,
  PublicVoucherAttributes,
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
  
  @Get('/stream/s/:id')
  public static async stream(
    @Request() req: ExpressRequest,
    @Path() id: number
  ) {
    // not paywall locked... yet
    const media = await SummaryMedia.findOne(({
      where: {
        key: 'tts',
        parentId: id,
        type: 'audio',
      },
    }));
    if (!media || !media.path) {
      req.res.status(404).json({ message: 'Not Found' });
      return;
    }
    try {
      const stream = fs.createReadStream(await S3Service.getObject({ Key: media.path }));
      req.res.setHeader('content-type', 'audio/mpeg');
      stream.pipe(req.res);
      stream.on('end', () => {
        req.res.status(200).end();
      });
    } catch (e) {
      req.res.status(500).end();
    }
  }
  
  @Post('/localize')
  public static async localize(
    @Request() req: ExpressRequest,
    @Body() body: LocalizeRequest
  ): Promise<BulkResponse<PublicSummaryTranslationAttributes>> {
    const {
      resourceId, resourceType, locale, 
    } = body;
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
          const translatedString = await GoogleService.translateText(Array.isArray(property) ? property.join('\n') : property, body.locale);
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

  @Post('iap')
  public static async processPurchase(
    @Request() req,
    @Body() body: PurchaseRequest
  ): Promise<PublicVoucherAttributes> {
    return await IapService.processPurchase(body);
  }
  
}