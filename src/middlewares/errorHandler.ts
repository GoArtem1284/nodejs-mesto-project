import { NextFunction, Request, Response } from 'express';
import { isCelebrateError } from 'celebrate';


export default (err: any, req: Request, res: Response, next: NextFunction) => {
  if (isCelebrateError(err)) {
    const errorDetails = err.details.get('body')
      || err.details.get('params')
      || err.details.get('headers');
    const message = errorDetails?.message ?? 'Переданы некорректные данные';
    return res.status(400).send({ message });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).send({ message: 'Validation error' });
  }
  if (err.name === 'CastError') {
    return res.status(400).send({ message: 'Incorrect _id' });
  }
  if (err.code === 11000) {
    return res.status(409).send({ message: 'We already have user with such email' });
  }
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).send({ message: 'You need to be authorized' });
  }
  if (err.statusCode === 401) {
    return res.status(401).send({ message: err.message });
  }
  if (err.statusCode === 403) {
    return res.status(403).send({ message: err.message });
  }
  if (err.statusCode === 404) {
    return res.status(404).send({ message: err.message });
  }

  return res.status(500).send({ message: 'Server error' });
}