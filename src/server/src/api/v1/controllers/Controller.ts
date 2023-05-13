import { DBService } from '../../../services';

export abstract class BaseControllerWithPersistentStorageAccess {
  
  static get store() { 
    return DBService.sq;
  }
  
}