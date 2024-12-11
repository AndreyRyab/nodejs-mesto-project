import { constants } from 'http2';
import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

import Card from '../models/card';
import BadRequestError from '../errors/bad-request-error';

import { IAuthContext, RequestWithUserType } from '../types';
import NotFoundError from '../errors/not-found-error';
import ForbiddenError from '../errors/forbidden-error';

export const createCard = async (
  req: RequestWithUserType,
  res: Response<unknown, IAuthContext>,
  next: NextFunction,
) => {
  try {
    const card = await Card.create({
      name: req.body.name,
      link: req.body.link,
      owner: req.user?._id,
      likes: [],
      createdAt: Date.now(),
    });

    return res.status(constants.HTTP_STATUS_CREATED).send(card);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }

    return next(error);
  }
};

export const getCardList = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const cardList = await Card.find({});

    return res.send(cardList);
  } catch (error) {
    return next(error);
  }
};

export const deleteCard = async (req: RequestWithUserType, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;

    const deletedCard = await Card.findOneAndDelete({ _id: cardId, owner: req.user?._id }).orFail(() => new ForbiddenError('Forbidden'));

    return res.send(deletedCard);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Not valid card ID'));
    }

    return next(error);
  }
};

export const likeCard = async (req: RequestWithUserType, res: Response, next: NextFunction) => {
  try {
    const likedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true },
    ).orFail(() => new NotFoundError('Card not found'));

    return res.send(likedCard);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Not valid card ID'));
    }

    return next(error);
  }
};

export const dislikeCard = async (req: RequestWithUserType, res: Response, next: NextFunction) => {
  try {
    const likedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user?._id } },
      { new: true },
    ).orFail(() => new NotFoundError('Card not found'));

    return res.send(likedCard);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Not valid card ID'));
    }

    return next(error);
  }
};
