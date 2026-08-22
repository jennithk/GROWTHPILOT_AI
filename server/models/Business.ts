import mongoose, { Schema, Document } from 'mongoose';

export interface IBusiness extends Document {
  userId: string;
  businessName: string;
  industry: string;
  description: string;
  products: string;
  targetLocation: string;
  targetCustomers: string;
  businessGoal: string;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessSchema = new Schema<IBusiness>({
  userId: { type: String, required: true, index: true },
  businessName: { type: String, required: true, trim: true },
  industry: { type: String, required: true },
  description: { type: String, required: true },
  products: { type: String, required: true },
  targetLocation: { type: String, required: true },
  targetCustomers: { type: String, required: true },
  businessGoal: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const BusinessModel = mongoose.models.Business || mongoose.model<IBusiness>('Business', BusinessSchema);
