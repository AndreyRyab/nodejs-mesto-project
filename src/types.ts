import { Request } from 'express';

export interface IAuthContext {
  user?: {
    _id: string;
  }
}

export type RequestWithUserType = Request & IAuthContext;

export interface ICustomError extends Error {
  statusCode: number;
}
