import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import Card from '../models/card';
import { ForbiddenError, NotFoundError } from '../errors';
import HTTP_STATUSES from '../errors/status-codes';

interface ICreateCard {
  name: string;
  link: string;
}

export const createCard = async (
  req: Request<{}, {}, ICreateCard>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, link } = req.body;

    const card = await Card.create({
      name,
      link,
      owner: new Types.ObjectId(req.user!._id),
    });

    return res.status(HTTP_STATUSES.CREATED).send(card);
  } catch (err) {
    return next(err);
  }
};

export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cards = await Card.find();

    return res.status(HTTP_STATUSES.SUCCESS).send(cards);
  } catch (err) {
    return next(err);
  }
};

export const deleteCard = async (
  req: Request<{ cardId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const card = await Card.findById(req.params.cardId);

    if (!card) {
      return next(new NotFoundError('There is no such card'));
    }

    const isNotOwner = card.owner.toString() !== req.user!._id.toString();

    if (isNotOwner) {
      return next(new ForbiddenError('You have no rights to delete this card'));
    }

    await card.deleteOne();
    return res.status(HTTP_STATUSES.SUCCESS).send(card);
  } catch (err) {
    return next(err);
  }
};

export const likeCard = async (
  req: Request<{ cardId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user!._id } },
      { new: true },
    );
    if (!card) {
      return next(new NotFoundError('No card with such _id'));
    }
    return res.status(HTTP_STATUSES.SUCCESS).send(card);
  } catch (err) {
    return next(err);
  }
};

export const dislikeCard = async (
  req: Request<{ cardId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user!._id } },
      { new: true },
    );
    if (!card) {
      return next(new NotFoundError('No card with such _id'));
    }
    return res.status(HTTP_STATUSES.SUCCESS).send(card);
  } catch (err) {
    return next(err);
  }
};
