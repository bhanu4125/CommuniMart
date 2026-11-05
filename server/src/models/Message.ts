import mongoose, { Schema, Document } from 'mongoose';
import { IMessage } from '../types';

export interface IMessageDocument extends Omit<IMessage, '_id' | 'sender' | 'recipient' | 'product' | 'order'>, Document {
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  product?: mongoose.Types.ObjectId;
  order?: mongoose.Types.ObjectId;
}

const MessageSchema = new Schema<IMessageDocument>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
    text: { type: String, required: true, trim: true },
    isQuickReply: { type: Boolean, default: false },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

MessageSchema.index({ sender: 1, recipient: 1, createdAt: 1 });
MessageSchema.index({ recipient: 1, read: 1 });

export const Message = mongoose.model<IMessageDocument>('Message', MessageSchema);
