import mongoose, { Schema, Document } from 'mongoose';

export interface IUserWallet extends Document {
  userId: string;
  walletAddress: string;
  walletType: 'BTC' | 'ETH' | 'USDT' | 'PAYPAL';
  balance: number;
  isActive: boolean;
  isVerified: boolean;
  publicKey?: string;
  encryptedPrivateKey?: string;
  derivationPath?: string;
  assignedAt: Date;
  lastSyncedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserWalletSchema = new Schema<IUserWallet>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
      index: true
    },
    walletAddress: {
      type: String,
      required: true,
      index: true
    },
    walletType: {
      type: String,
      enum: ['BTC', 'ETH', 'USDT', 'PAYPAL'],
      required: true
    },
    balance: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    publicKey: {
      type: String
    },
    encryptedPrivateKey: {
      type: String
    },
    derivationPath: {
      type: String
    },
    assignedAt: {
      type: Date,
      default: Date.now
    },
    lastSyncedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export const UserWallet = mongoose.model<IUserWallet>('UserWallet', UserWalletSchema);
