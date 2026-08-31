import { Router } from 'express';
import usersRouter from './users';
import cardsRouter from './cards';
import auth from '../middlewares/auth';
import { createUser, login } from '../controllers/users';
import { validateSignIn, validateSignUp } from '../validators/users';

const router = Router();

router.post('/signup', validateSignUp, createUser);
router.post('/signin', validateSignIn, login);

router.use(auth);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

export default router;
