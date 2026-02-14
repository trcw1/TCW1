import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isAdmin: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  backupCodes: string[];
  googleId?: string;
  profilePicture?: string;
  authProvider: 'local' | 'google';
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password: {
      type: String,
      minlength: 8
    },
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    twoFactorSecret: {
      type: String,
      default: null
    },
    backupCodes: [
      {
        type: String
      }
    ],
    googleId: {
      type: String,
      sparse: true,
      unique: true
    },
    profilePicture: {
      type: String
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local'
    },
    lastLogin: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
