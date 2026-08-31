import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { NotFoundError, UnauthorizedError } from '../errors';
import HTTP_STATUSES from '../errors/status-codes';

const { JWT_SECRET = 'default' } = process.env;

interface ICreateUserRequest {
  name?: string;
  about?: string;
  avatar?: string;
  email: string;
  password: string;
}

interface IUpdateProfileRequest {
  name: string;
  about: string;
}

interface IUpdateAvatarRequest {
  avatar: string;
}

interface ILoginRequest {
  email: string;
  password: string;
}

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findById(req.user!._id);

    if (!user) {
      return next(new NotFoundError('There is no such user'));
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
      return next(new NotFoundError('User not found'));
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
    const { email, password, name, about, avatar } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hash,
      ...(name && { name }),
      ...(about && { about }),
      ...(avatar && { avatar }),
    });

    const userObject = user.toObject();
    const { password: _password, ...userWithoutPassword } = userObject;

    return res.status(HTTP_STATUSES.CREATED).send(userWithoutPassword);
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
      return next(new NotFoundError('User not found'));
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
      return next(new NotFoundError('User not found'));
    }

    return res.status(HTTP_STATUSES.SUCCESS).send(user);
  } catch (err) {
    return next(err);
  }
};

export const login = async (
  req: Request<{}, {}, ILoginRequest>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new UnauthorizedError('Wrong email or password'));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return next(new UnauthorizedError('Wrong email or password'));
    }

    const token: string = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 3600000 * 24 * 7,
      })
      .status(HTTP_STATUSES.SUCCESS)
      .send({ token });
  } catch (e) {
    return next(e);
  }
};
