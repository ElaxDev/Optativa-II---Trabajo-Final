import User from '../models/user.model';
import { Request, Response, NextFunction } from 'express';
import generateToken from '../libs/jwt';
import { ILogin, IRegister, IUserUpdateRequest } from '../types';
import { customError } from '../middlewares/errorMiddleware';

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username, newPassword, newPasswordConfirm, password } =
    req.body as IUserUpdateRequest;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new customError('User not found', 404);
    }

    if (newPassword || newPasswordConfirm) {
      if (!password) {
        throw new customError('Old password is required', 400);
      }
      if (!newPassword) {
        throw new customError('New password is required', 400);
      }
      if (!newPasswordConfirm) {
        throw new customError('You need to confirm the new password', 400);
      }
      if (newPassword !== newPasswordConfirm) {
        throw new customError('Passwords do not match', 403);
      }
      if (!(await user.matchPassword(password))) {
        throw new customError('Incorrect password', 401);
      }

      user.password = newPassword;
    }

    if (username) {
      if (!username.match(/^[a-zA-Z0-9_]*$/)) {
        throw new customError(
          'Username can only contain letters, numbers and underscores',
          400
        );
      }
      if (username.length < 1 || username.length > 20) {
        throw new customError(
          'Username must be between 1 and 20 characters',
          400
        );
      }
      if (await User.findOne({ username })) {
        throw new customError('Username already taken', 400);
      }
      if (!password) {
        throw new customError('Password is required', 400);
      }
      if (!(await user.matchPassword(password))) {
        throw new customError('Incorrect password', 401);
      }

      if (user.username !== username) user.username = username;
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
    });
  } catch (error) {
    return next(error as customError);
  }
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username, password, passwordConfirmation }: IRegister = req.body;
  try {
    const userExists = await User.findOne({ username: username }).collation({
      locale: 'en',
      strength: 2,
    });

    if (userExists) {
      throw new customError('An user with that username already exists!', 400);
    }

    if (password !== passwordConfirmation) {
      throw new customError('Passwords do not match!', 400);
    }

    const user = await User.create({ username, password });

    if (!user) throw new customError('Invalid user data', 400);

    generateToken(res, user._id.toString());
    return res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    return next(error as customError);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const { username, password }: ILogin = req.body;
  try {
    if (!username || !password)
      throw new customError('Please provide username and password', 400);

    const user = await User.findOne({ username: username }).collation({
      locale: 'en',
      strength: 2,
    });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id.toString());
      return res.status(200).json({
        _id: user._id,
        username: user.username,
      });
    } else {
      throw new customError('Incorrect username or password', 401);
    }
  } catch (error) {
    return next(error as customError);
  }
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({ message: 'User logged out' });
}
