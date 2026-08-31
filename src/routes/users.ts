import {
  getCurrentUser,
  getUserById,
  getUsers,
  udapteAvatar,
  updateUser,
} from '../controllers/users';
import { Router } from 'express';
import {
  validateUpdateAvatar,
  validateUpdateProfile,
  validateUserId,
} from '../validators/users';

const router = Router();

router.get('/me', getCurrentUser);
router.patch('/me', validateUpdateProfile, updateUser);
router.patch('/me/avatar', validateUpdateAvatar, udapteAvatar);

router.get('/', getUsers);
router.get('/:userId', validateUserId, getUserById);

export default router;
