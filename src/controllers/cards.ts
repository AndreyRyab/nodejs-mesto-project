import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

import Card from '../models/card';
import BadRequestError from '../errors/bad-request-error';

import { AuthContext } from '../types';
import NotFoundError from '../errors/not-found-error';

export const createCard = async (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  try {
    const card = await Card.create({
      name: req.body.name,
      link: req.body.link,
      owner: res.locals.user._id,
      likes: [],
      createdAt: Date.now(),
    });

    return res.send(card);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }

    return next(error);
  }
};

export const getCardList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userList = await Card.find({});

    return res.send(userList);
  } catch (error) {
    return next(error);
  }
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;

    const deletedCard = await Card.findByIdAndDelete(cardId).orFail(() => new NotFoundError('Card not found'));

    return res.send(deletedCard);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Not valid card ID'));
    }

    return next(error);
  }
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const likedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: res.locals.user._id } },
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

export const dislikeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const likedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: res.locals.user._id } },
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
