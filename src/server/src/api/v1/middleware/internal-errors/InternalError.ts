export class InternalError extends Error {
  
  code = 6969;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: any[];

  get sensitive() {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, errors?: any[]) {
    super(message);
    this.errors = errors;
  }

}