import { Request as ExpressRequest } from 'express';
import {
  Body,
  Post,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

import { BulkResponse, LocalizeRequest } from '../';
import { GoogleService } from '../../../../services';
import { AuthError, InternalError } from '../../middleware';
import {
  PublicSummaryAttributes,
  PublicTranslationAttributes,
  Recap,
  RecapAttributes,
  RecapTranslation,
  Summary,
  SummaryTranslation,
} from '../../schema';

@Route('/v1/localize')
@Tags('Localization')
@Security('jwt')
@SuccessResponse(200, 'OK')
@SuccessResponse(201, 'Created')
@SuccessResponse(204, 'No Content')
@Response<AuthError>(401, 'Unauthorized')
@Response<InternalError>(500, 'Internal Error')
export class LocalizationController {
  
  @Post('/')
  public static async localize(
    @Request() req: ExpressRequest,
    @Body() body: LocalizeRequest
  ): Promise<BulkResponse<PublicTranslationAttributes>> {
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
    } else
    if (resourceType === 'recap') {
      const recap = await Recap.findByPk(resourceId);
      if (!recap) {
        throw new InternalError('Recap not found');
      }
      const translations = await RecapTranslation.scope('public').findAndCountAll({ where: { locale, parentId: resourceId } });
      if (translations.count >= 2) {
        return translations;
      } else {
        const attributes = ['title', 'text'] as (keyof RecapAttributes)[];
        for (const attribute of attributes) {
          const property = recap[attribute];
          const translatedString = await GoogleService.translateText(Array.isArray(property) ? property.join('\n') : property, body.locale);
          await RecapTranslation.upsert({
            attribute,
            locale,
            parentId: resourceId,
            value: translatedString,
          });
        }
        return await RecapTranslation.scope('public').findAndCountAll({ where: { locale, parentId: resourceId } });
      }
    } else {
      throw new InternalError('Invalid resource type');
    }
  }
  
}