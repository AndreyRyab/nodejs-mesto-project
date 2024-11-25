import { Router } from 'express';

import {
  createUser,
  getUserList,
  getUserById,
  updateProfile,
  updateAvatar,
} from '../controllers/users';

const usersRouter = Router();

usersRouter.post('/', createUser);

usersRouter.get('/:userId', getUserById);

usersRouter.get('/', getUserList);

usersRouter.patch('/me', updateProfile);

usersRouter.patch('/me/avatar', updateAvatar);

export default usersRouter;
