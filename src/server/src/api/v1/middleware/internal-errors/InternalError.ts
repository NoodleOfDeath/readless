export class InternalError extends Error {
  
  code = 6969;

  get sensitive() {
    return false;
  }

  constructor(message: string) {
    super(message);
  }

}