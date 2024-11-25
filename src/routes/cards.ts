import { Router } from 'express';

import {
  createCard,
  deleteCard,
  dislikeCard,
  getCardList,
  likeCard,
} from '../controllers/cards';

const cardsRouter = Router();

cardsRouter.post('/', createCard);

cardsRouter.get('/', getCardList);

cardsRouter.delete('/:cardId', deleteCard);

cardsRouter.put('/:cardId/likes', likeCard);

cardsRouter.delete('/:cardId/likes', dislikeCard);

export default cardsRouter;
