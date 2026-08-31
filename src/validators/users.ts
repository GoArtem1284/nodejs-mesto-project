import { celebrate, Joi } from 'celebrate';
import URL_REGEX from '../utils/urlRegex';

const objectId = Joi.string().hex().length(24);

export const validateCreateUser = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().required().pattern(URL_REGEX),
  }),
});

export const validateUpdateProfile = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
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
