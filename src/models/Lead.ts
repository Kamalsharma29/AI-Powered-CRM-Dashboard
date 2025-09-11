import mongoose, { Document, Schema } from 'mongoose';

export interface ILead extends Document {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  source: 'website' | 'referral' | 'social-media' | 'email-campaign' | 'cold-call' | 'other';
  value?: number;
  notes?: string;
  assignedTo: mongoose.Types.ObjectId;
  lastContactDate?: Date;
  nextFollowUp?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>({
  name: {
    type: String,
    required: [true, 'Lead name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  company: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'],
    default: 'new',
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'social-media', 'email-campaign', 'cold-call', 'other'],
    default: 'other',
  },
  value: {
    type: Number,
    min: 0,
  },
  notes: {
    type: String,
    trim: true,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lastContactDate: {
    type: Date,
  },
  nextFollowUp: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Prevent re-compilation during development
const Lead = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;