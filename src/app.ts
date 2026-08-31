import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './middlewares/errorHandler';
import { NotFoundError } from './errors';

const PORT = 3000;
const DB_URL = 'mongodb://localhost:27017/mestodb';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.use(routes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Resource not exist'));
});

app.use(errorLogger);
app.use(errorHandler);

mongoose
  .connect(DB_URL)
  .then(() => {
    app.listen(PORT);
  })
  .catch(() => {
    process.exit(1);
  });
