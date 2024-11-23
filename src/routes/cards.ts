import { Router } from 'express';

import {
  createCard,
  deleteCard,
  dislikeCard,
  getCardList,
  likeCard,
} from '../controllers/cards';

const cardsRouter = Router();

cardsRouter.post('/', createCard as any);

cardsRouter.get('/', getCardList as any);

cardsRouter.delete('/:cardId', deleteCard as any);

cardsRouter.put('/:cardId/likes', likeCard as any);

cardsRouter.delete('/:cardId/likes', dislikeCard as any);

export default cardsRouter;
