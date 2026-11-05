import mongoose, { Schema, Document } from 'mongoose';
import { IOrder } from '../types';

export interface IOrderDocument extends Omit<IOrder, '_id' | 'product' | 'buyer' | 'seller'>, Document {
  product: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
}

const OrderSchema = new Schema<IOrderDocument>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
      type: String, 
      enum: ['Requested', 'Accepted by Neighbor', 'Ready for Handover', 'Completed', 'Cancelled'],
      default: 'Requested'
    },
    paymentMethod: { 
      type: String, 
      enum: ['direct_upi', 'cash_on_handover', 'society_escrow'],
      required: true 
    },
    paymentStatus: { 
      type: String, 
      enum: ['pending', 'paid', 'verified'],
      default: 'pending'
    },
    handoverOption: { 
      type: String, 
      enum: ['Doorstep Delivery', 'Club House / Security Gate Drop-box', 'Direct Pickup from Seller Flat'],
      required: true
    },
    handoverNote: { type: String, default: '' },
    totalAmount: { type: Number, required: true },
    upiReference: { type: String },
    requestedDates: {
      startDate: { type: Date },
      endDate: { type: Date }
    },
    review: {
      rating: { type: Number },
      comment: { type: String },
      badgesAwarded: { type: [String], default: [] },
      createdAt: { type: Date }
    },
    timeline: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String }
      }
    ]
  },
  { timestamps: true }
);

OrderSchema.index({ buyer: 1, createdAt: -1 });
OrderSchema.index({ seller: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });

export const Order = mongoose.model<IOrderDocument>('Order', OrderSchema);

