import mongoose, { Schema, Document } from 'mongoose';

export interface IAIAnalysis extends Document {
  userId: string;
  leadId?: string;
  analysisType: 'growth-strategy' | 'lead-scoring' | 'next-best-action' | 'campaign' | 'customer-message' | 'growth-insights';
  result: any;
  createdAt: Date;
}

const AIAnalysisSchema = new Schema<IAIAnalysis>({
  userId: { type: String, required: true, index: true },
  leadId: { type: String },
  analysisType: { 
    type: String, 
    required: true,
    enum: ['growth-strategy', 'lead-scoring', 'next-best-action', 'campaign', 'customer-message', 'growth-insights']
  },
  result: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const AIAnalysisModel = mongoose.models.AIAnalysis || mongoose.model<IAIAnalysis>('AIAnalysis', AIAnalysisSchema);
