import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { createUser, login } from './controllers/users';
import cookieParser from 'cookie-parser';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './middlewares/errorHandler';
import { validateSignIn, validateSignUp } from './validators/users';
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from './errors/status-codes';

const PORT = 3000;
const DB_URL = 'mongodb://localhost:27017/mestodb';

const app = express();

app.listen(PORT, () => console.log('IM IN!!!'));

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.post('/signin', validateSignIn, login);
app.post('/signup', validateSignUp, createUser);

app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(errorLogger);
app.use(errorHandler);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const { name } = err;

  if (name === 'ValidationError') {
    return res
      .status(BAD_REQUEST)
      .send({ message: err.message || 'Validation error' });
  }

  if (name === 'CastError') {
    return res.status(BAD_REQUEST).send({ message: 'Wrong _id' });
  }

  if (err.statusCode === NOT_FOUND) {
    return res.status(NOT_FOUND).send({ message: err.message });
  }

  return res
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: 'Server error' + err });
});

mongoose
  .connect(DB_URL)
  .then(() => console.log('Base connected!'))
  .catch((e) => console.log(`Connection error! ${e}`));
