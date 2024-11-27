import express, {
  Request,
  Response,
  NextFunction,
  json,
  urlencoded,
} from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import mongoose, { Error } from 'mongoose';

import { AuthContext } from './types';

import router from './routes';
import errorHandler from './middlewares/error-handler';

dotenv.config();
const { PORT = 3000, MONGO_URL } = process.env;

const app = express();

app.use(helmet());

app.use(json());
app.use(urlencoded({ extended: true }));

app.use((_: Request, res: Response<unknown, AuthContext>, next: NextFunction) => {
  res.locals.user = {
    _id: process.env.MOCKED_USER_ID ?? '',
  };

  next();
});

app.use('/', router);

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
