import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  passwordHash: string;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    avatar: { type: String, default: '' },
    role: { 
      type: String, 
      enum: ['resident', 'verified_seller', 'committee_admin'], 
      default: 'resident' 
    },
    phase: { type: String, required: true, default: 'Phase 1 - Green Meadows' },
    block: { type: String, required: true, trim: true },
    flatNumber: { type: String, required: true, trim: true },
    hideFlatNumber: { type: Boolean, default: false },
    verificationStatus: { 
      type: String, 
      enum: ['pending', 'verified', 'rejected'], 
      default: 'verified' // Auto-verify or set via code/admin
    },
    verificationCode: { type: String },
    badges: { type: [String], default: ['Verified Resident'] },
    rating: { type: Number, default: 5.0 },
    ratingCount: { type: Number, default: 1 },
    upiId: { type: String, default: 'society.resident@okaxis' },
    joinedDate: { type: Date, default: Date.now },
    bio: { type: String, default: '' }
  },
  { timestamps: true }
);

UserSchema.index({ block: 1 });
UserSchema.index({ phase: 1 });

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

export const User = mongoose.model<IUserDocument>('User', UserSchema);
