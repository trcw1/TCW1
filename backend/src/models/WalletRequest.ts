import mongoose, { Schema, Document } from 'mongoose';

export interface IWalletRequest extends Document {
  userId: string;
  walletType: 'BTC' | 'ETH' | 'USDT';
  status: 'pending' | 'approved' | 'rejected';
  walletAddress?: string;
  requestedAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  approvalNotes?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WalletRequestSchema = new Schema<IWalletRequest>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User'
    },
    walletType: {
      type: String,
      enum: ['BTC', 'ETH', 'USDT'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    walletAddress: {
      type: String,
      sparse: true
    },
    requestedAt: {
      type: Date,
      default: Date.now
    },
    approvedAt: {
      type: Date
    },
    rejectedAt: {
      type: Date
    },
    approvalNotes: {
      type: String
    },
    rejectionReason: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export const WalletRequest = mongoose.model<IWalletRequest>('WalletRequest', WalletRequestSchema);
