import { celebrate, Joi } from 'celebrate';
import { URL_REGEX } from '../utils/urlRegex';

const objectId = Joi.string().hex().length(24);

export const validateSignUp = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(URL_REGEX),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export const validateSignIn = celebrate({
  body: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export const validateUpdateProfile = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
  }),
});

export const validateUpdateAvatar = celebrate({
  body: Joi.object({
    avatar: Joi.string().required().pattern(URL_REGEX),
  }),
});

export const validateUserId = celebrate({
  params: Joi.object({
    userId: objectId.required(),
  }),
});