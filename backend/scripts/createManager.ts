import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User';

const createManager = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/engineer-management');
    console.log('Connected to MongoDB...');

    // Check if manager exists
    const existingManager = await User.findOne({ email: 'manager@example.com' });
    
    if (existingManager) {
      console.log('Manager already exists');
      // Reset password to default
      const hashedPassword = await bcrypt.hash('password123', 10);
      existingManager.password = hashedPassword;
      await existingManager.save();
      console.log('Manager password reset to: password123');
    } else {
      // Create manager user
      const manager = new User({
        email: 'manager@example.com',
        password: 'password123', // Will be hashed by the pre-save middleware
        name: 'John Manager',
        role: 'manager',
        department: 'Engineering',
        employmentType: 'full-time'
      });

      await manager.save();
      console.log('Manager created successfully');
      console.log('Email: manager@example.com');
      console.log('Password: password123');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createManager(); 