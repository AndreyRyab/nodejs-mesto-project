import { constants } from 'http2';
import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';

import User from '../models/user';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    });

    return res.status(constants.HTTP_STATUS_CREATED).send(newUser);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }

    return next(error);
  }
};

export const getUserList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userList = await User.find({});

    return res.send(userList);
  } catch (error) {
    return next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).orFail(() => new NotFoundError('User not found'));

    return res.send(user);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Not valid user ID'));
    }

    return next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;
    const { _id } = res.locals.user;

    const updatedUser = await User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true }).orFail(() => new NotFoundError('User not found'));

    return res.send(updatedUser);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError('Not valid data provided'));
    }

    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Not valid user ID'));
    }

    return next(error);
  }
};

export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    const { _id } = res.locals.user;

    const updatedUser = await User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true }).orFail(() => new NotFoundError('User not found'));

    return res.send(updatedUser);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError('Field Avatar must be a valid URL'));
    }

    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Not valid user ID'));
    }

    return next(error);
  }
};
