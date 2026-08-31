import mongoose from 'mongoose';
import URL_REGEX from '../utils/urlRegex';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    validate: {
      validator: (url: string) => URL_REGEX.test(url),
      message: 'Wrong avatar url',
    },
    required: true,
  },
});

export default mongoose.model<IUser>('user', userSchema);
