import mongoose, { Schema, Document, CallbackError } from 'mongoose';

interface IProject {
  startDate: Date;
  endDate: Date;
}

export interface IAssignment extends Document {
  engineerId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  allocationPercentage: number;
  startDate: Date;
  endDate: Date;
  role: string;
}

const AssignmentSchema = new Schema<IAssignment>({
  engineerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async function(engineerId: mongoose.Types.ObjectId) {
        const User = mongoose.model('User');
        const engineer = await User.findOne({ _id: engineerId, role: 'engineer' });
        return !!engineer;
      },
      message: 'Invalid engineer ID'
    }
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  allocationPercentage: {
    type: Number,
    required: true,
    min: [0, 'Allocation percentage cannot be negative'],
    max: [100, 'Allocation percentage cannot exceed 100']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(this: IAssignment, value: Date) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  role: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Compound indexes for faster queries and unique constraints
AssignmentSchema.index({ engineerId: 1, projectId: 1 });
AssignmentSchema.index({ projectId: 1, startDate: 1, endDate: 1 });
AssignmentSchema.index({ engineerId: 1, startDate: 1, endDate: 1 });

// Middleware to validate assignment dates against project dates
AssignmentSchema.pre('save', async function(this: IAssignment, next) {
  try {
    const Project = mongoose.model<IProject>('Project');
    const project = await Project.findById(this.projectId);
    
    if (!project) {
      throw new Error('Project not found');
    }

    const startDate = this.get('startDate') as Date;
    const endDate = this.get('endDate') as Date;

    if (startDate < project.startDate || endDate > project.endDate) {
      throw new Error('Assignment dates must be within project duration');
    }

    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

// Middleware to validate engineer's total allocation
AssignmentSchema.pre('save', async function(this: IAssignment, next) {
  try {
    const Assignment = mongoose.model<IAssignment>('Assignment');
    
    // Find overlapping assignments for the engineer
    const overlappingAssignments = await Assignment.find({
      engineerId: this.engineerId,
      _id: { $ne: this._id }, // Exclude current assignment
      $or: [
        {
          startDate: { $lte: this.endDate },
          endDate: { $gte: this.startDate }
        }
      ]
    });

    // Calculate total allocation for the overlapping period
    const currentAllocation = this.get('allocationPercentage') as number;
    let totalAllocation = currentAllocation;
    
    overlappingAssignments.forEach(assignment => {
      totalAllocation += assignment.allocationPercentage;
    });

    if (totalAllocation > 100) {
      throw new Error('Total allocation exceeds engineer\'s capacity');
    }

    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema); 