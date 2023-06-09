import { Query } from 'express-serve-static-core';

import { DBService } from '../../../services';

export abstract class BaseControllerWithPersistentStorageAccess {
  
  public static get store() { 
    return DBService.sq;
  }

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
  
}