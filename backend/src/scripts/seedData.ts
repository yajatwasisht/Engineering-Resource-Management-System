import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Project from '../models/Project';
import Assignment from '../models/Assignment';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://yajatwasisht2309:23092001yW@cluster0.wvv2vfu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Project.deleteMany({}),
      Assignment.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Create manager
    const manager = await User.create({
      email: 'manager@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'John Manager',
      role: 'manager',
      department: 'Engineering',
      employmentType: 'full-time'
    });

    // Create engineers
    const engineers = await User.create([
      {
        email: 'sarah@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Sarah Chen',
        role: 'engineer',
        department: 'Engineering',
        seniority: 'senior',
        skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
        employmentType: 'full-time',
        maxCapacity: 100
      },
      {
        email: 'mike@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Mike Johnson',
        role: 'engineer',
        department: 'Data Science',
        seniority: 'mid',
        skills: ['Python', 'Machine Learning', 'Data Science'],
        employmentType: 'full-time',
        maxCapacity: 100
      },
      {
        email: 'alex@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Alex Rodriguez',
        role: 'engineer',
        department: 'Engineering',
        seniority: 'junior',
        skills: ['JavaScript', 'React', 'HTML', 'CSS'],
        employmentType: 'part-time',
        maxCapacity: 50
      },
      {
        email: 'lisa@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Lisa Wong',
        role: 'engineer',
        department: 'DevOps',
        seniority: 'senior',
        skills: ['Java', 'Spring Boot', 'DevOps', 'Kubernetes'],
        employmentType: 'full-time',
        maxCapacity: 100
      }
    ]);

    // Create projects
    const projects = await Project.create([
      {
        name: 'E-commerce Platform Redesign',
        description: 'Modernize the e-commerce platform with React and TypeScript',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-08-31'),
        requiredSkills: ['React', 'TypeScript', 'Node.js'],
        teamSize: 3,
        status: 'active',
        managerId: manager._id
      },
      {
        name: 'ML Recommendation Engine',
        description: 'Build an AI-powered product recommendation system',
        startDate: new Date('2024-04-01'),
        endDate: new Date('2024-09-30'),
        requiredSkills: ['Python', 'Machine Learning', 'Data Science'],
        teamSize: 2,
        status: 'planning',
        managerId: manager._id
      },
      {
        name: 'Mobile App Development',
        description: 'Develop a cross-platform mobile app using React Native',
        startDate: new Date('2024-05-01'),
        endDate: new Date('2024-10-31'),
        requiredSkills: ['React', 'JavaScript', 'Mobile Development'],
        teamSize: 2,
        status: 'active',
        managerId: manager._id
      },
      {
        name: 'Cloud Infrastructure Migration',
        description: 'Migrate on-premise systems to cloud infrastructure',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-12-31'),
        requiredSkills: ['DevOps', 'Kubernetes', 'AWS'],
        teamSize: 2,
        status: 'planning',
        managerId: manager._id
      }
    ]);

    // Create assignments
    await Assignment.create([
      {
        engineerId: engineers[0]._id, // Sarah
        projectId: projects[0]._id, // E-commerce
        allocationPercentage: 70,
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-08-31'),
        role: 'Tech Lead'
      },
      {
        engineerId: engineers[2]._id, // Alex
        projectId: projects[0]._id, // E-commerce
        allocationPercentage: 40,
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-08-31'),
        role: 'Frontend Developer'
      },
      {
        engineerId: engineers[1]._id, // Mike
        projectId: projects[1]._id, // ML
        allocationPercentage: 100,
        startDate: new Date('2024-04-01'),
        endDate: new Date('2024-09-30'),
        role: 'ML Engineer'
      },
      {
        engineerId: engineers[2]._id, // Alex
        projectId: projects[2]._id, // Mobile App
        allocationPercentage: 10,
        startDate: new Date('2024-05-01'),
        endDate: new Date('2024-10-31'),
        role: 'UI Developer'
      },
      {
        engineerId: engineers[3]._id, // Lisa
        projectId: projects[3]._id, // Cloud Migration
        allocationPercentage: 80,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-12-31'),
        role: 'DevOps Lead'
      }
    ]);

    console.log('Successfully seeded data');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData(); 