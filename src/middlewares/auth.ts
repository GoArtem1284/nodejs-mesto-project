import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors';

const { JWT_SECRET = 'default' } = process.env;

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  let token: string | undefined;

  if (authorization && authorization.startsWith('Bearer ')) {
    token = authorization.replace('Bearer ', '');
  }

  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new UnauthorizedError('You need to be authorized'));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { _id: string };
    req.user = payload;
    return next();
  } catch (e) {
    return next(new UnauthorizedError('You need to be authorized'));
  }
};
