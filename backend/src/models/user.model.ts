import { Schema, model } from 'mongoose';
import { IUser, userRoles } from '../types';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      index: {
        unique: true,
        collation: { locale: 'en', strength: 2 },
      },
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(userRoles),
      default: userRoles.employee,
      required: true,
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.method(
  'matchPassword',
  async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
  }
);

export default model<IUser>('User', UserSchema);
