import { constants } from 'http2';
import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import User from '../models/user';

import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/сonflict-error';
import UnauthorizedError from '../errors/unauthorized-error';

import { DEV_SALT, DEV_SECRET } from '../constants/dev-secret';

import { RequestWithUserType } from '../types';

const MONGO_CONFLICT_ERROR_CODE = 'E11000';

dotenv.config();
const { SALT = DEV_SALT, SECRET_KEY = DEV_SECRET } = process.env;

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.password) {
      return next(new BadRequestError('Password is required'));
    }

    const hash = await bcrypt.hash(req.body.password, Number(SALT));

    const newUser = await User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    });

    if (newUser.password) {
      newUser.password = '';
    }

    return res.status(constants.HTTP_STATUS_CREATED).send(newUser);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }

    if (error instanceof Error && error.message.startsWith(MONGO_CONFLICT_ERROR_CODE)) {
      return next(new ConflictError('User with this name already exists'));
    }

    return next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User
      .findOne({ email })
      .select('+password')
      .orFail(() => new UnauthorizedError('Email or password is wrong'));

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return next(new UnauthorizedError('Email or password is wrong'));
    }

    const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });

    return res.cookie('jwt', token, { httpOnly: true }).send({ message: 'Authorization successful' });
  } catch (error) {
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

export const getUser = async (req: RequestWithUserType, res: Response, next: NextFunction) => {
  try {
    const { user } = req;

    const userData = await User.findById(user?._id);

    return res.send(userData);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Not valid user ID'));
    }

    return next(error);
  }
};

export const updateProfile = async (
  req: RequestWithUserType,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, about } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      { name, about },
      { new: true, runValidators: true },
    ).orFail(() => new NotFoundError('User not found'));

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

export const updateAvatar = async (
  req: RequestWithUserType,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      { avatar },
      { new: true, runValidators: true },
    ).orFail(() => new NotFoundError('User not found'));

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
