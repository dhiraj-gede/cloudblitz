import mongoose, { Document, Schema } from 'mongoose';

export interface IEnquiry extends Document {
  customerName: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: mongoose.Types.ObjectId;
  createdBy?: mongoose.Types.ObjectId;
  notes?: string[];
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const enquirySchema = new Schema<IEnquiry>({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    minlength: [2, 'Customer name must be at least 2 characters'],
    maxlength: [100, 'Customer name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  notes: [{
    type: String,
    trim: true
  }],
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, __v, ...rest } = ret;
      return { id: _id, ...rest };
    }
  }
});

// Indexes for performance
enquirySchema.index({ email: 1 });
enquirySchema.index({ status: 1 });
enquirySchema.index({ priority: 1 });
enquirySchema.index({ assignedTo: 1 });
enquirySchema.index({ createdBy: 1 });
enquirySchema.index({ deletedAt: 1 });
enquirySchema.index({ createdAt: -1 });

// Compound indexes
enquirySchema.index({ status: 1, createdAt: -1 });
enquirySchema.index({ assignedTo: 1, status: 1 });
enquirySchema.index({ priority: 1, status: 1 });

// Text index for search
enquirySchema.index({
  customerName: 'text',
  email: 'text',
  message: 'text'
}, {
  name: 'enquiry_search_index'
});

export const Enquiry = mongoose.model<IEnquiry>('Enquiry', enquirySchema);