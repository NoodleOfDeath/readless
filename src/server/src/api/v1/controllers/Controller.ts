import { Request } from 'express';

import { CustomHeader } from './types';
import { SUPPORTED_LOCALES, SupportedLocale } from '../../../core/locales';
import { firstOf } from '../../../core/utils';
import { DBService } from '../../../services';

export abstract class BaseController {

  public static serializeParams(req: Request) {
    const params = Object.fromEntries(Object.entries({
      ... req.query, ...req.params, ...req.headers, 
    }).map(([key, value]) => { 
      if (value === 'true') {
        return [key, true];
      }
      if (value === 'false') {
        return [key, false];
      }
      if (value === 'null') {
        return [key, null];
      }
      if (value === 'undefined') {
        return [key, false];
      }
      if (typeof value === 'string' && /^\d+$/.test(value)) {
        return [key, parseInt(value, 10)];
      }
      return [key, value];
    }));
    return {
      ...params,
      locale: this.parseLocale(req),
      platform: req.get(CustomHeader.PLATFORM),
      userId: req.get(CustomHeader.USER_ID),
      uuid: req.get(CustomHeader.UUID),
      version: req.get(CustomHeader.VERSION),
    };
  }

  public static parseLocale(req: Request) {
    const code = firstOf(req.query['locale']) || req.get(CustomHeader.LOCALE);
    if (!(new RegExp(SUPPORTED_LOCALES.join('|')).test(code))) {
      return undefined;
    }
    return code as SupportedLocale;
  }

}

export abstract class BaseControllerWithPersistentStorageAccess extends BaseController {
  
  public static get store() { 
    return DBService.sq;
  }
  
}