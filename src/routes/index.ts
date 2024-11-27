import { Router } from 'express';

import usersRouter from './users';
import cardsRouter from './cards';

const router = Router();

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', (_, res) => res.status(404).send({ message: 'Not found resource' }));

export default router;
