import HTTP_STATUSES from './status-codes';

export default class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUSES.NOT_FOUND;
  }
}
