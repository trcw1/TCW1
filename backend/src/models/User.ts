import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  backupCodes: string[];
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
      required: true,
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
    lastLogin: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
