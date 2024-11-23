import { Router } from 'express';

import {
  createUser,
  getUserList,
  getUserById,
  updateProfile,
  updateAvatar,
} from '../controllers/users';

const usersRouter = Router();

usersRouter.post('/', createUser as any);

usersRouter.get('/:userId', getUserById as any);

usersRouter.get('/', getUserList as any);

usersRouter.patch('/me', updateProfile as any);

usersRouter.patch('/me/avatar', updateAvatar as any);

export default usersRouter;
