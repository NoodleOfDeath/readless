export class InternalError extends Error {

  get sensitive() {
    return false;
  }

  constructor(message: string) {
    super(message);
  }

}