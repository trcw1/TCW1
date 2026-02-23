import mongoose, { Schema, Document } from 'mongoose';

export interface ILoginApproval extends Document {
  userId: string;
  ipAddress: string;
  userAgent: string;
  deviceName?: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  approvalToken: string;
  expiresAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LoginApprovalSchema = new Schema<ILoginApproval>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User'
    },
    ipAddress: {
      type: String,
      required: true
    },
    userAgent: {
      type: String,
      required: true
    },
    deviceName: {
      type: String
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'expired'],
      default: 'pending'
    },
    approvalToken: {
      type: String,
      required: true,
      unique: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    approvedAt: {
      type: Date
    },
    rejectedAt: {
      type: Date
    },
    rejectionReason: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export const LoginApproval = mongoose.model<ILoginApproval>('LoginApproval', LoginApprovalSchema);
