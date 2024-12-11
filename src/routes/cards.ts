import { Router } from 'express';

import {
  createCard,
  deleteCard,
  dislikeCard,
  getCardList,
  likeCard,
} from '../controllers/cards';
import { validateCardId } from '../middlewares/validation';

const cardsRouter = Router();

cardsRouter.post('/', createCard);

cardsRouter.get('/', getCardList);

cardsRouter.delete('/:cardId', validateCardId, deleteCard);

cardsRouter.put('/:cardId/likes', validateCardId, likeCard);

cardsRouter.delete('/:cardId/likes', validateCardId, dislikeCard);

export default cardsRouter;
