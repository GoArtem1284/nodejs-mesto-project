import { Router } from 'express';
import usersRouter from './users';
import cardsRouter from './cards';
import auth from '../middlewares/auth';
import { createUser } from '../controllers/users';
import { validateCreateUser } from '../validators/users';

const router = Router();

router.post('/users', validateCreateUser, createUser);

router.use(auth);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

export default router;
