import {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from 'express';
import { constants } from 'http2';

const errorHandler: ErrorRequestHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = (err as any).statusCode ?? constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;

  const message = statusCode === constants.HTTP_STATUS_INTERNAL_SERVER_ERROR ? 'Internal server error' : err.message;

  res.status(statusCode).send({ message });
};

export default errorHandler;
