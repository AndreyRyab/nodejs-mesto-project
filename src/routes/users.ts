import { Router } from 'express';

import {
  getUserList,
  getUser,
  updateProfile,
  updateAvatar,
} from '../controllers/users';
import { validateProfileBody, validateAvatarBody } from '../middlewares/validation';

const usersRouter = Router();

usersRouter.get('/', getUserList);

usersRouter.get('/me', getUser);

usersRouter.patch('/me', validateProfileBody, updateProfile);

usersRouter.patch('/me/avatar', validateAvatarBody, updateAvatar);

export default usersRouter;
