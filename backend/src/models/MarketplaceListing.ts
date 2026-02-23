import mongoose, { Schema, Document } from 'mongoose';

export interface IMarketplaceListing extends Document {
  sellerId: string;
  title: string;
  description: string;
  category: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  price: number;
  currency: string;
  quantity: number;
  images: string[];
  status: 'active' | 'sold' | 'expired' | 'delisted';
  rating: number;
  sales: number;
  tags: string[];
  location?: string;
  shipsTo?: string[];
  shippingCost?: number;
  acceptsOffers: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MarketplaceListingSchema = new Schema<IMarketplaceListing>(
  {
    sellerId: {
      type: String,
      required: true,
      ref: 'User',
      index: true
    },
    title: {
      type: String,
      required: true,
      index: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      index: true
    },
    condition: {
      type: String,
      enum: ['new', 'like-new', 'good', 'fair', 'poor'],
      default: 'new'
    },
    price: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    quantity: {
      type: Number,
      default: 1
    },
    images: [String],
    status: {
      type: String,
      enum: ['active', 'sold', 'expired', 'delisted'],
      default: 'active'
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    sales: {
      type: Number,
      default: 0
    },
    tags: [String],
    location: String,
    shipsTo: [String],
    shippingCost: Number,
    acceptsOffers: {
      type: Boolean,
      default: true
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const MarketplaceListing = mongoose.model<IMarketplaceListing>('MarketplaceListing', MarketplaceListingSchema);
