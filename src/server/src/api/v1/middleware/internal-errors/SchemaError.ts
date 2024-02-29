import { InternalError } from './InternalError';

export class SchemaError extends InternalError {

  get sensitive() {
    return true; 
  }
  
  constructor(message: string) {
    super(message);
  }

}