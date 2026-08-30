import { celebrate, Joi } from 'celebrate';
import URL_REGEX from '../utils/urlRegex';

const objectId = Joi.string().hex().length(24);

export const validateCreateCard = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(URL_REGEX),
  }),
});

export const validateCardId = celebrate({
  params: Joi.object({
    cardId: objectId.required(),
  }),
});
