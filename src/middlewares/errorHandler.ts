import { Request, Response } from 'express';
import { isCelebrateError } from 'celebrate';
import HTTP_STATUSES from '../errors/status-codes';

export default (err: any, req: Request, res: Response) => {
  if (isCelebrateError(err)) {
    const errorDetails =
      err.details.get('body') ||
      err.details.get('params') ||
      err.details.get('headers');
    const message = errorDetails?.message ?? 'Переданы некорректные данные';
    return res.status(HTTP_STATUSES.BAD_REQUEST).send({ message });
  }

  if (err.name === 'ValidationError') {
    return res
      .status(HTTP_STATUSES.BAD_REQUEST)
      .send({ message: 'Validation error' });
  }
  if (err.name === 'CastError') {
    return res
      .status(HTTP_STATUSES.BAD_REQUEST)
      .send({ message: 'Incorrect _id' });
  }
  if (err.code === 11000) {
    return res
      .status(HTTP_STATUSES.CONFLICT)
      .send({ message: 'We already have user with such email' });
  }
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res
      .status(HTTP_STATUSES.UNAUTHORIZED)
      .send({ message: 'You need to be authorized' });
  }
  if (err.statusCode === HTTP_STATUSES.UNAUTHORIZED) {
    return res
      .status(HTTP_STATUSES.UNAUTHORIZED)
      .send({ message: err.message });
  }
  if (err.statusCode === HTTP_STATUSES.FORBIDDEN) {
    return res.status(HTTP_STATUSES.FORBIDDEN).send({ message: err.message });
  }
  if (err.statusCode === HTTP_STATUSES.NOT_FOUND) {
    return res.status(HTTP_STATUSES.NOT_FOUND).send({ message: err.message });
  }

  return res
    .status(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
    .send({ message: 'На сервере произошла ошибка' });
};
