import { Request } from 'express';
import { Query } from 'express-serve-static-core';

import { DBService } from '../../../services';

export abstract class BaseController {

  public static serializeParams(params: Query) {
    return Object.fromEntries(Object.entries(params).map(([key, value]) => { 
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
  }

  public static extractParams(req: Request) {
    return {
      locale: req.get('x-locale'),
      platform: req.get('x-platform'),
      userId: req.get('x-user-id'),
      uuid: req.get('x-uuid'),
      version: req.get('x-version'),
      ...req.params,
      ...BaseControllerWithPersistentStorageAccess.serializeParams(req.query),
    };
  }

}

export abstract class BaseControllerWithPersistentStorageAccess extends BaseController {
  
  public static get store() { 
    return DBService.sq;
  }
  
}