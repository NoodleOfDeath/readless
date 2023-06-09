import fs from 'fs';

import { Request as ExpressRequest } from 'express';
import { Op } from 'sequelize';
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
  TtsRequest,
} from '../';
import { 
  GoogleService,
  IapService,
  PurchaseRequest,
  S3Service,
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
    const stream = fs.createReadStream(await S3Service.getObject({ Key: media.path }));
    req.res.setHeader('content-type', 'audio/mpeg');
    stream.pipe(req.res);
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
  
  @Post('/tts')
  public static async tts(
    @Request() req: ExpressRequest,
    @Body() body: TtsRequest
  ): Promise<BulkResponse<PublicSummaryMediaAttributes>> {
    const jwt = req.headers.authorization.split(' ')[1];
    const { 
      resourceType, 
      resourceId,
      voice,
    } = body;
    const subscribed = await IapService.validateSubscription(jwt);
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
      await SummaryMedia.upsert({
        key: 'tts',
        parentId: resourceId,
        type: 'audio',
        url: result.url,
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

  @Post('iap')
  public static async processPurchase(
    @Request() req,
    @Body() body: PurchaseRequest
  ): Promise<PublicVoucherAttributes> {
    return await IapService.processPurchase(body);
  }
  
}