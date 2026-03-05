export class CustomError extends Error {
  statusCode: number;

  constructor(customCode: number, customMessage: string) {
    super(customMessage);
    this.statusCode = customCode;
  }
}
