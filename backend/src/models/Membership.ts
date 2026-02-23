import mongoose, { Schema, Document } from 'mongoose';

export interface IMembership extends Document {
  userId: string;
  membershipTier: 'basic' | 'premium' | 'gold' | 'platinum';
  status: 'active' | 'inactive' | 'suspended' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  renewalDate?: Date;
  autoRenew: boolean;
  monthlyFee: number;
  currency: string;
  benefits: string[];
  paymentMethod: string;
  lastPaymentDate?: Date;
  nextPaymentDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MembershipSchema = new Schema<IMembership>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
      unique: true,
      index: true
    },
    membershipTier: {
      type: String,
      enum: ['basic', 'premium', 'gold', 'platinum'],
      default: 'basic'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'cancelled'],
      default: 'active'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    renewalDate: {
      type: Date
    },
    autoRenew: {
      type: Boolean,
      default: true
    },
    monthlyFee: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    benefits: [String],
    paymentMethod: {
      type: String,
      required: true
    },
    lastPaymentDate: {
      type: Date
    },
    nextPaymentDate: {
      type: Date,
      required: true
    },
    notes: String
  },
  {
    timestamps: true
  }
);

export const Membership = mongoose.model<IMembership>('Membership', MembershipSchema);
