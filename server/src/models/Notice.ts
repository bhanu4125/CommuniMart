import mongoose, { Schema, Document } from 'mongoose';
import { INotice } from '../types';

export interface INoticeDocument extends Omit<INotice, '_id' | 'author'>, Document {
  author: mongoose.Types.ObjectId;
}

const NoticeSchema = new Schema<INoticeDocument>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Request / Borrow', 'Flash Sale / Treat', 'Notice / Alert', 'Skill Offer']
    },
    urgency: {
      type: String,
      enum: ['normal', 'urgent'],
      default: 'normal'
    },
    resolved: { type: Boolean, default: false },
    repliesCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

NoticeSchema.index({ createdAt: -1 });
NoticeSchema.index({ category: 1, resolved: 1 });

export const Notice = mongoose.model<INoticeDocument>('Notice', NoticeSchema);
