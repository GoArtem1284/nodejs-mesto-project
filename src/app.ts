import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { createUser, getUserById, getUsers, login, udapteAvatar, updateUser } from './controllers/users';
import { createCard, deleteCard, dislikeCard, getCards, likeCard } from './controllers/cards';
import cookieParser from 'cookie-parser';

const PORT = 3000;
const DB_URL = 'mongodb://localhost:27017/mestodb'
const app = express();


app.listen(PORT, () => console.log("IM IN!!!"));
app.use(express.json());
app.use(cookieParser());

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '6a8c85e0746081428f4066d2' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.post('/signin', login)
app.post('/signup', createUser)

app.get('/users', getUsers)
app.get('/users/:userId', getUserById)
app.patch('/users/me', updateUser)
app.patch('/users/me/avatar', udapteAvatar)

app.get('/cards', getCards)
app.post('/cards', createCard)
app.delete('/cards/:cardId', deleteCard)
app.put('/cards/:cardId/likes', likeCard)
app.delete('/cards/:cardId/likes', dislikeCard);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const { name } = err;

  if (name === 'ValidationError') {
    return res
      .status(400)
      .send({ message: err.message || 'Переданы некорректные данные' });
  }

  if (name === 'CastError') {
    return res
      .status(400)
      .send({ message: 'Передан некорректный _id' });
  }

  if (err.statusCode === 404) {
    return res
      .status(404)
      .send({ message: err.message });
  }

  return res
    .status(500)
    .send({ message: 'На сервере произошла ошибка' });
});

mongoose.connect(DB_URL)
.then(() => console.log("Base connected!"))
.catch((e) => console.log(`Connection error! ${e}`));