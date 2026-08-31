import { NextFunction, Request, Response } from 'express';
import { isCelebrateError } from 'celebrate';
import HTTP_STATUSES from '../errors/status-codes';

interface IErrorWithStatus extends Error {
  statusCode?: number;
  code?: number;
}

export default (
  err: IErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }
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
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  return res
    .status(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
    .send({ message: 'На сервере произошла ошибка' });
};
