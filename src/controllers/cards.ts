import { NextFunction, Request, Response } from "express";
import Card from "../models/card";
import { Types } from "mongoose";

interface ICreateCard {
  name : string;
  link : string;
}

export const createCard = async (req : Request<{}, {}, ICreateCard>, res: Response) => {
  const {name, link} = req.body;

  const card = await Card.create({
    name,
    link,
    owner : new Types.ObjectId(req.user!._id)
  })

  res.status(201).send(card)
}

export const getCards = async (req: Request, res: Response) => {
  const cards = await Card.find();

  res.send(cards);
}

export const deleteCard = async (req : Request<{cardId : string}>, res : Response, next: NextFunction) => {
  try {
    const cardToDelete =  await Card.findByIdAndDelete(req.params.cardId);
    if (!cardToDelete) {
      const error = new Error('No card with such _id');
      (error as any).statusCode = 404;
      throw error;
    }
    res.send(cardToDelete)
  } catch (err) {
    next(err);
  }
}

export const likeCard = async (req : Request<{cardId: string}>, res : Response, next: NextFunction) => {
  try {
    const card =  await Card.findByIdAndUpdate(req.params.cardId, {$addToSet : {likes : req.user!._id}}, {new : true})
    if (!card) {
      const error = new Error('No card with such _id');
      (error as any).statusCode = 404;
      throw error;
    }
    res.send(card)
  } catch (err) {
    next(err);
  }
}

export const dislikeCard = async (req : Request<{cardId: string}>, res : Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user!._id } },
      { new: true }
    );
    if (!card) {
      const error = new Error('No card with such _id');
      (error as any).statusCode = 404;
      throw error;
    }
    res.send(card)
  } catch (err) {
    next(err);
  }
}