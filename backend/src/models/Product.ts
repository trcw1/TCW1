import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  sku: string;
  price: number;
  currency: string;
  category: string;
  stock: number;
  images: string[];
  specifications?: Record<string, string>;
  sellerId?: string;
  isActive: boolean;
  rating: number;
  reviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      index: true
    },
    description: {
      type: String,
      required: true
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    price: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    category: {
      type: String,
      required: true,
      index: true
    },
    stock: {
      type: Number,
      default: 0
    },
    images: [
      {
        type: String
      }
    ],
    specifications: {
      type: Schema.Types.Mixed
    },
    sellerId: {
      type: String,
      ref: 'User'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
