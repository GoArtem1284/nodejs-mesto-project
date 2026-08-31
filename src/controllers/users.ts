import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import AppError from '../errors';
import HTTP_STATUSES from '../errors/status-codes';

interface ICreateUserRequest {
  name: string;
  about: string;
  avatar: string;
}

interface IUpdateProfileRequest {
  name: string;
  about: string;
}

interface IUpdateAvatarRequest {
  avatar: string;
}

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findById(req.user!._id);

    if (!user) {
      return next(
        new AppError('There is no such user', HTTP_STATUSES.NOT_FOUND),
      );
    }

    return res.status(HTTP_STATUSES.SUCCESS).send(user);
  } catch (error) {
    return next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.find();

    return res.status(HTTP_STATUSES.SUCCESS).send(users);
  } catch (err) {
    return next(err);
  }
};

export const getUserById = async (
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(new AppError('User not found', HTTP_STATUSES.NOT_FOUND));
    }

    return res.status(HTTP_STATUSES.SUCCESS).send(user);
  } catch (err) {
    return next(err);
  }
};

export const createUser = async (
  req: Request<{}, {}, ICreateUserRequest>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.status(HTTP_STATUSES.CREATED).send(user);
  } catch (err) {
    return next(err);
  }
};

export const updateUser = async (
  req: Request<{}, {}, IUpdateProfileRequest>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { name: req.body.name, about: req.body.about },
      { new: true, runValidators: true },
    );

    if (!user) {
      return next(new AppError('User not found', HTTP_STATUSES.NOT_FOUND));
    }

    return res.status(HTTP_STATUSES.SUCCESS).send(user);
  } catch (err) {
    return next(err);
  }
};

export const udapteAvatar = async (
  req: Request<{}, {}, IUpdateAvatarRequest>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true },
    );

    if (!user) {
      return next(new AppError('User not found', HTTP_STATUSES.NOT_FOUND));
    }

    return res.status(HTTP_STATUSES.SUCCESS).send(user);
  } catch (err) {
    return next(err);
  }
};
