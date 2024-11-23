
import mongoose, { Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<IUser>({
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
  },
});

export default mongoose.model<IUser>('user', userSchema);
