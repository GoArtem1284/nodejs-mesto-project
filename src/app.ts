import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { createUser } from './controllers/users';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './middlewares/errorHandler';
import { HTTP_STATUSES } from './errors/status-codes';
import { validateCreateUser } from './validators/users';
import AppError from './errors';

const PORT = 3000;
const DB_URL = 'mongodb://localhost:27017/mestodb';

const app = express();

app.listen(PORT);

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.post('/users', validateCreateUser, createUser);

app.use(routes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError('Recource not exists', HTTP_STATUSES.NOT_FOUND));
});

app.use(errorLogger);
app.use(errorHandler);

mongoose.connect(DB_URL);
