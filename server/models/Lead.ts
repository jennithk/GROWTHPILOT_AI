import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  userId: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  interest: string;
  notes: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
  aiScore?: number;
  aiCategory?: 'Hot' | 'Warm' | 'Cold';
  aiAnalysis?: {
    leadScore: number;
    category: 'Hot' | 'Warm' | 'Cold';
    purchaseIntent: string;
    customerNeed: string;
    nextBestAction: string;
    priority: 'High' | 'Medium' | 'Low';
    followUpTime: string;
    followUpMessage: string;
    analyzedAt: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, default: '' },
  company: { type: String, default: '' },
  source: { type: String, default: 'Website' },
  interest: { type: String, default: '' },
  notes: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'], 
    default: 'New' 
  },
  aiScore: { type: Number },
  aiCategory: { type: String, enum: ['Hot', 'Warm', 'Cold'] },
  aiAnalysis: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const LeadModel = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
