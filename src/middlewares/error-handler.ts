import {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from 'express';
import { constants } from 'http2';

import { ICustomError } from '../types';

const errorHandler: ErrorRequestHandler = (
  err: ICustomError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err.statusCode ?? constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;

  const message = statusCode === constants.HTTP_STATUS_INTERNAL_SERVER_ERROR ? 'Internal server error' : err.message;

  res.status(statusCode).send({ message });
};

export default errorHandler;
