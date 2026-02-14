import mongoose, { Schema, Document } from 'mongoose';

export interface IBlockchainTransaction extends Document {
  userId: string;
  transactionHash: string;
  blockNumber?: number;
  fromAddress: string;
  toAddress: string;
  amount: number;
  currency: 'BTC' | 'ETH' | 'USDT';
  type: 'send' | 'receive' | 'trade';
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  gasUsed?: number;
  gasFee?: number;
  blockchainNetwork: 'mainnet' | 'testnet';
  verified: boolean;
  metadata?: {
    tradePair?: string;
    tradePrice?: number;
    tradeType?: 'buy' | 'sell';
  };
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
}

const BlockchainTransactionSchema = new Schema<IBlockchainTransaction>(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    transactionHash: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    blockNumber: {
      type: Number
    },
    fromAddress: {
      type: String,
      required: true
    },
    toAddress: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      enum: ['BTC', 'ETH', 'USDT'],
      required: true
    },
    type: {
      type: String,
      enum: ['send', 'receive', 'trade'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'failed'],
      default: 'pending'
    },
    confirmations: {
      type: Number,
      default: 0
    },
    gasUsed: {
      type: Number
    },
    gasFee: {
      type: Number
    },
    blockchainNetwork: {
      type: String,
      enum: ['mainnet', 'testnet'],
      default: 'mainnet'
    },
    verified: {
      type: Boolean,
      default: false
    },
    metadata: {
      tradePair: String,
      tradePrice: Number,
      tradeType: {
        type: String,
        enum: ['buy', 'sell']
      }
    },
    confirmedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
BlockchainTransactionSchema.index({ userId: 1, createdAt: -1 });
BlockchainTransactionSchema.index({ transactionHash: 1 });
BlockchainTransactionSchema.index({ status: 1, createdAt: -1 });

export const BlockchainTransaction = mongoose.model<IBlockchainTransaction>(
  'BlockchainTransaction',
  BlockchainTransactionSchema
);
