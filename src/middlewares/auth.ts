import jwt from 'jsonwebtoken';
import { NextFunction, Response, Request } from 'express';

import UnauthorizedError from '../errors/unauthorized-error';
import { DEV_SECRET } from '../constants/dev-secret';

import { RequestWithUserType } from '../types';

const { SECRET_KEY = DEV_SECRET } = process.env;

const auth = (req: Request, _: Response, next: NextFunction) => {
  if (!req.cookies.jwt) {
    return next(new UnauthorizedError('Authorization required'));
  }

  let payload;

  try {
    payload = jwt.verify(req.cookies.jwt, SECRET_KEY) as RequestWithUserType['user'];
  } catch (err) {
    return next(new UnauthorizedError('Authorization required'));
  }

  (req as RequestWithUserType).user = payload;

  return next();
};

export default auth;
