import express, {
  json,
  urlencoded,
} from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import mongoose, { Error } from 'mongoose';
import { errors } from 'celebrate';

import { requestLogger, errorLogger } from './middlewares/logger';

import { createUser, login } from './controllers/users';

import router from './routes';

import auth from './middlewares/auth';
import errorHandler from './middlewares/error-handler';
import { validateUserBody } from './middlewares/validation';

import limiter from './utils/rate-limiter';

dotenv.config();
const { PORT = 3000, MONGO_URL } = process.env;

const app = express();

app.use(helmet());

app.use(limiter);

app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signin', validateUserBody, login);
app.post('/signup', validateUserBody, createUser);

app.use(auth);

app.use('/', router);

app.use(errorLogger);
app.use(errors());
app.use('/', errorHandler);

const start = async () => {
  try {
    await mongoose.connect(MONGO_URL ?? '');

    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('Failed to connect to MongoDB', (error as Error).message);
  }

  app.listen(+PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
start();
