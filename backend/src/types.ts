import { Types, Document } from 'mongoose';

export interface decodedJWT {
  id: Types.ObjectId;
  iat: number;
  exp: number;
}

export interface IRegister {
  username: string;
  password: string;
  passwordConfirmation: string;
}

export interface ILogin {
  username: string;
  password: string;
}

export interface ItemInterface extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  countInStock: number;
  imageURL: string;
}

export enum userRoles {
  admin = 'administrador',
  employee = 'empleado',
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  password: string;
  role: userRoles;
  createdAt?: Date;
  updatedAt?: Date;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

export interface IUserUpdateRequest {
  username?: string;
  password?: string;
  newPassword?: string;
  newPasswordConfirm?: string;
}
