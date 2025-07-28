import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  masterPasswordHash: string;
  salt: string;
  subscriptionStatus: 'free' | 'active' | 'cancelled' | 'expired';
  subscriptionId?: string;
  subscriptionPlanId?: string;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  passwordCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  masterPasswordHash: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  subscriptionStatus: {
    type: String,
    enum: ['free', 'active', 'cancelled', 'expired'],
    default: 'free',
  },
  subscriptionId: {
    type: String,
  },
  subscriptionPlanId: {
    type: String,
  },
  subscriptionStartDate: {
    type: Date,
  },
  subscriptionEndDate: {
    type: Date,
  },
  passwordCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);