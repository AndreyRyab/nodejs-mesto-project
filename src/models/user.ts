import mongoose, { Schema, Document } from 'mongoose';
import isEmail from 'validator/lib/isEmail';

import URL_REGEX from '../constants/validation';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate: {
        validator: (v: string): boolean => isEmail(v),
        message: 'Field Email must be a valid email',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator(v: string) {
          return URL_REGEX.test(v);
        },
        message: 'Field Avatar must be a valid URL',
      },
    },
  },
  { versionKey: false },
);

export default mongoose.model<IUser>('user', userSchema);
