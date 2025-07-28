import mongoose, { Schema, Document } from 'mongoose';

export interface IPassword extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  encryptedData: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PasswordSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  encryptedData: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'General',
  },
}, {
  timestamps: true,
});

// Indexes for faster queries
PasswordSchema.index({ userId: 1 });
PasswordSchema.index({ userId: 1, category: 1 });
PasswordSchema.index({ userId: 1, title: 'text' });

export default mongoose.models.Password || mongoose.model<IPassword>('Password', PasswordSchema);