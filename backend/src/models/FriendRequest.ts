import mongoose, { Schema, Document } from 'mongoose';

export interface IFriendRequest extends Document {
  from: string; // userId
  to: string;   // userId
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  updatedAt: Date;
}

const FriendRequestSchema = new Schema<IFriendRequest>({
  from: { type: String, required: true, ref: 'User' },
  to: { type: String, required: true, ref: 'User' },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' }
}, {
  timestamps: true
});

export const FriendRequest = mongoose.model<IFriendRequest>('FriendRequest', FriendRequestSchema);
