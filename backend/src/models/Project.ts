import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  requiredSkills: string[];
  teamSize: number;
  status: 'planning' | 'active' | 'completed';
  managerId: mongoose.Types.ObjectId;
}

const ProjectSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(this: IProject, value: Date) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  requiredSkills: {
    type: [String],
    required: true,
    validate: {
      validator: function(skills: string[]) {
        return skills.length > 0;
      },
      message: 'At least one required skill must be specified'
    }
  },
  teamSize: {
    type: Number,
    required: true,
    min: [1, 'Team size must be at least 1']
  },
  status: {
    type: String,
    required: true,
    enum: ['planning', 'active', 'completed'],
    default: 'planning'
  },
  managerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async function(managerId: mongoose.Types.ObjectId) {
        const User = mongoose.model('User');
        const manager = await User.findOne({ _id: managerId, role: 'manager' });
        return !!manager;
      },
      message: 'Invalid manager ID'
    }
  }
}, {
  timestamps: true
});

// Indexes for faster queries
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ managerId: 1 });
ProjectSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.model<IProject>('Project', ProjectSchema); 