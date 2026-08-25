import { NextFunction, Request, Response } from "express";
import bcrypt from 'bcryptjs';
import User from "../models/user";
import jwt from 'jsonwebtoken'
import { AppError } from "errors";

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
  email : string,
  password: string
}

export const getCurrentUser = async (req : Request, res : Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!._id);

    if (!user) {
      const error : any = new Error('There is no such user');
      (error as any).statusCode = 404;
      throw error
    }

    res.send(user)
  } catch (error) {
    next(error)
  }
};

export const getUsers = async (req : Request, res : Response) => {
  const users = await User.find();

  res.send(users);
};

export const getUserById = async (req : Request<{ userId: string }>, res : Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      const error = new Error('User not found');
      (error as any).statusCode = 404;
      throw error;
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
}

export const createUser = async (req:Request<{}, {}, ICreateUserRequest>, res : Response, next: NextFunction ) => {
  try {
    const { email, password, name, about, avatar } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password : hash
    })

    const userObject = user.toObject();
    const {password : userPassword, ...userWithoutPassword } =  userObject

    res.status(201).send(userWithoutPassword)
  } catch (err) {
    next(err);
  }
}

export const updateUser = async (req : Request<{}, {}, IUpdateProfileRequest>, res : Response) => {
  const user =  await User.findByIdAndUpdate(req.user!._id, {name : req.body.name, about: req.body.about}, {new : true, runValidators : true})

  res.send(user)
}

export const udapteAvatar = async (req : Request<{}, {}, IUpdateAvatarRequest>, res : Response) => {
  const user =  await User.findByIdAndUpdate(req.user!._id, {avatar : req.body.avatar}, {new : true, runValidators : true})

  res.send(user);
}

export const login = async (req: Request<{}, {}, ILoginRequest>, res : Response, next : NextFunction) => {
  try {
    const {email, password} = req.body

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return next(new AppError('Wrong email or passwod', 401))
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return next(new AppError('Wrong email or passwod', 401))
    }

    const token : string = jwt.sign(
      {_id: user._id},
      JWT_SECRET,
      { expiresIn : '7d'}
    )

      res
      .cookie('token', token, {
        httpOnly : true,
        sameSite : 'lax',
        maxAge: 3600000 * 24 * 7,
      })
      .send({ message : "Successful login"})


  } catch (e) {
    next(e)
  }
}