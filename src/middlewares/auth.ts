import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import AppError from '../errors';
import HTTP_STATUSES from '../errors/status-codes';

const { JWT_SECRET = 'default-secret' } = process.env;

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(
      new AppError('You need to be authorized', HTTP_STATUSES.UNAUTHORIZED),
    );
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { _id: string };
    req.user = payload;
    return next();
  } catch (e) {
    return next(
      new AppError('You need to be authorized', HTTP_STATUSES.UNAUTHORIZED),
    );
  }
};
