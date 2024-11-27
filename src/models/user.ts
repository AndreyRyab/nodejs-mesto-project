import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Field Name is required'],
      unique: true,
      minlength: 2,
      maxlength: 30,
    },
    about: {
      type: String,
      required: [true, 'Field About is required'],
      minlength: 2,
      maxlength: 12,
    },
    avatar: {
      type: String,
      required: [true, 'Field Avatar is required'],
      validate: {
        validator(v: string) {
          return /^https?:\/\/(www\.)?[a-z0-9-]+\.[a-z]{2,10}\/?[a-z0-9-._~:/?#[\]@!$&'()*+,;=]*#?$/i
            .test(v);
        },
        message: 'Field Avatar must be a valid URL',
      },
    },
  },
  { versionKey: false },
);

export default mongoose.model<IUser>('user', userSchema);
