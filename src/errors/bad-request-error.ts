import HTTP_STATUSES from './status-codes';

export default class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUSES.BAD_REQUEST;
  }
}
