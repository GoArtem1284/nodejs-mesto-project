import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { createUser, getCurrentUser, getUserById, getUsers, login, udapteAvatar, updateUser } from './controllers/users';
import { createCard, deleteCard, dislikeCard, getCards, likeCard } from './controllers/cards';
import cookieParser from 'cookie-parser';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from 'middlewares/errorHandler';
import { validateSignIn, validateSignUp, validateUpdateAvatar, validateUpdateProfile, validateUserId } from 'validators/users';
import { validateCardId, validateCreateCard } from 'validators/cards';

const PORT = 3000;
const DB_URL = 'mongodb://localhost:27017/mestodb'
const app = express();


app.listen(PORT, () => console.log("IM IN!!!"));
app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

app.post('/signin', validateSignIn, login)
app.post('/signup', validateSignUp,createUser)

app.use(auth);

app.get('/users/me', getCurrentUser);
app.get('/users', getUsers);
app.get('/users/:userId', validateUserId, getUserById);
app.patch('/users/me', validateUpdateProfile, updateUser);
app.patch('/users/me/avatar', validateUpdateAvatar, udapteAvatar);

app.get('/cards', getCards);
app.post('/cards', validateCreateCard, createCard);
app.delete('/cards/:cardId', validateCardId, deleteCard);
app.put('/cards/:cardId/likes', validateCardId, likeCard);
app.delete('/cards/:cardId/likes', validateCardId, dislikeCard);

app.use(errorLogger);
app.use(errorHandler);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const { name } = err;

  if (name === 'ValidationError') {
    return res
      .status(400)
      .send({ message: err.message || 'Validation error' });
  }

  if (name === 'CastError') {
    return res
      .status(400)
      .send({ message: 'Wrong _id' });
  }

  if (err.statusCode === 404) {
    return res
      .status(404)
      .send({ message: err.message });
  }

  return res
    .status(500)
    .send({ message: 'Server error' });
});

mongoose.connect(DB_URL)
.then(() => console.log("Base connected!"))
.catch((e) => console.log(`Connection error! ${e}`));