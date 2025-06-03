import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'engineer' | 'manager';
  skills?: string[];
  seniority?: 'junior' | 'mid' | 'senior';
  employmentType: 'full-time' | 'part-time';
  maxCapacity?: number;
  currentAllocation: number;
  department: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['manager', 'engineer'],
    required: true,
  },
  skills: {
    type: [String],
    required: function(this: IUser) {
      return this.role === 'engineer';
    },
    default: undefined
  },
  seniority: {
    type: String,
    enum: ['junior', 'mid', 'senior'],
    required: function(this: IUser) {
      return this.role === 'engineer';
    },
    default: undefined
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time'],
    required: true,
    default: 'full-time',
  },
  maxCapacity: {
    type: Number,
    min: 0,
    max: 100,
    required: function(this: IUser) {
      return this.role === 'engineer';
    },
    default: undefined
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  currentAllocation: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const password = this.get('password') as string;
    this.set('password', await bcrypt.hash(password, 10));
  }
  
  // Set maxCapacity based on employmentType
  if (this.isModified('employmentType')) {
    this.maxCapacity = this.get('employmentType') === 'full-time' ? 100 : 50;
  }
  
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  const password = this.get('password') as string;
  return bcrypt.compare(candidatePassword, password);
};

// Remove password when converting to JSON
UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ department: 1 });

export default mongoose.model<IUser>('User', UserSchema); 