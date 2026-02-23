import mongoose, { Schema, Document } from 'mongoose';

export interface IDepositConfirmation extends Document {
  userId: string;
  depositAmount: number;
  currency: 'BTC' | 'ETH' | 'USDT' | 'USD';
  transactionHash?: string;
  fromAddress?: string;
  toAddress: string;
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled';
  confirmations: number;
  requiredConfirmations: number;
  depositDate: Date;
  confirmedAt?: Date;
  failureReason?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DepositConfirmationSchema = new Schema<IDepositConfirmation>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
      index: true
    },
    depositAmount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      enum: ['BTC', 'ETH', 'USDT', 'USD'],
      required: true
    },
    transactionHash: {
      type: String,
      index: true
    },
    fromAddress: {
      type: String
    },
    toAddress: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'failed', 'cancelled'],
      default: 'pending'
    },
    confirmations: {
      type: Number,
      default: 0
    },
    requiredConfirmations: {
      type: Number,
      default: 3
    },
    depositDate: {
      type: Date,
      default: Date.now
    },
    confirmedAt: {
      type: Date
    },
    failureReason: {
      type: String
    },
    notes: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export const DepositConfirmation = mongoose.model<IDepositConfirmation>('DepositConfirmation', DepositConfirmationSchema);
