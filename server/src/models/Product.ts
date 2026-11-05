import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from '../types';

export interface IProductDocument extends Omit<IProduct, '_id' | 'seller'>, Document {
  seller: mongoose.Types.ObjectId;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { 
      type: String, 
      required: true,
      enum: [
        'Fresh Home Bakes & Meals',
        'Pre-loved Electronics',
        'Home & Furniture',
        'Kids & Toys',
        'Skill Exchange & Services',
        'Garden & Plants',
        'Books & Hobbies',
        'Tools & Utilities'
      ]
    },
    listingMode: { 
      type: String, 
      required: true, 
      enum: ['sell', 'rent', 'giveaway'] 
    },
    price: { type: Number, required: true, min: 0 },
    rentDuration: { type: String, enum: ['hour', 'day', 'week'] },
    rentDeposit: { type: Number, default: 0 },
    condition: { 
      type: String, 
      enum: ['Brand New', 'Like New', 'Good', 'Fair'] 
    },
    images: { type: [String], default: [] },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    handoverOptions: { 
      type: [String], 
      default: ['Doorstep Delivery', 'Club House / Security Gate Drop-box', 'Direct Pickup from Seller Flat'] 
    },
    available: { type: Boolean, default: true },
    block: { type: String, required: true },
    tags: { type: [String], default: [] },
    views: { type: Number, default: 0 },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

ProductSchema.index({ title: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ category: 1, available: 1 });
ProductSchema.index({ listingMode: 1 });
ProductSchema.index({ block: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });

export const Product = mongoose.model<IProductDocument>('Product', ProductSchema);

