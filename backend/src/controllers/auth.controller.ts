import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import {Error} from 'mongoose';
import bcrypt from 'bcryptjs';

export const register = async (req: Request, res: Response) => {
  try {
    const { 
      email, 
      password, 
      name, 
      role,
      department,
      seniority,
      skills,
      employmentType = 'full-time'
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Validate required fields based on role
    if (role === 'engineer') {
      if (!seniority) {
        return res.status(400).json({ message: 'Seniority is required for engineers' });
      }
      if (!skills || !Array.isArray(skills) || skills.length === 0) {
        return res.status(400).json({ message: 'At least one skill is required for engineers' });
      }
    }

    if (!department) {
      return res.status(400).json({ message: 'Department is required' });
    }

    // Create new user with all required fields
    const user = new User({
      email,
      password, // Will be hashed by the pre-save middleware
      name,
      role,
      department,
      ...(role === 'engineer' && {
        seniority,
        skills,
        maxCapacity: employmentType === 'full-time' ? 100 : 50,
      }),
      employmentType,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return user data (password will be removed by toJSON method)
    res.status(201).json({
      token,
      user: user.toJSON()
    });
  } catch (error) {
    if (error instanceof Error.ValidationError && error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.keys(error.errors).reduce((acc, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {} as Record<string, string>)
      });
    }
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return user data
    res.json({
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
}; 