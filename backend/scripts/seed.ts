import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User';
import Project from '../src/models/Project';
import Assignment from '../src/models/Assignment';

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/engineer-management');
    console.log('Connected to MongoDB...');

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
    console.log('Created manager:', manager.email);

    // Create engineers
    const engineers = await User.create([
      {
        email: 'sarah@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Sarah Smith',
        role: 'engineer',
        department: 'Engineering',
        seniority: 'senior',
        skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
        employmentType: 'full-time',
        maxCapacity: 100,
        currentAllocation: 80
      },
      {
        email: 'mike@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Mike Johnson',
        role: 'engineer',
        department: 'Engineering',
        seniority: 'mid',
        skills: ['Python', 'Machine Learning', 'Data Science'],
        employmentType: 'full-time',
        maxCapacity: 100,
        currentAllocation: 60
      },
      {
        email: 'alex@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Alex Chen',
        role: 'engineer',
        department: 'Engineering',
        seniority: 'senior',
        skills: ['AWS', 'DevOps', 'Kubernetes', 'Docker'],
        employmentType: 'full-time',
        maxCapacity: 100,
        currentAllocation: 90
      },
      {
        email: 'lisa@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Lisa Brown',
        role: 'engineer',
        department: 'Engineering',
        seniority: 'junior',
        skills: ['React', 'JavaScript', 'HTML', 'CSS'],
        employmentType: 'part-time',
        maxCapacity: 50,
        currentAllocation: 40
      }
    ]);
    console.log('Created engineers:', engineers.map(e => e.email).join(', '));

    // Create projects
    const projects = await Project.create([
      {
        name: 'E-commerce Platform',
        description: 'Building a modern e-commerce platform with React and Node.js',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-30'),
        status: 'active',
        managerId: manager._id,
        teamSize: 3,
        requiredSkills: ['React', 'Node.js', 'TypeScript']
      },
      {
        name: 'ML Engine',
        description: 'Developing a machine learning engine for predictive analytics',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-08-31'),
        status: 'active',
        managerId: manager._id,
        teamSize: 2,
        requiredSkills: ['Python', 'Machine Learning', 'Data Science']
      },
      {
        name: 'Mobile App',
        description: 'Creating a cross-platform mobile application',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-07-31'),
        status: 'planning',
        managerId: manager._id,
        teamSize: 2,
        requiredSkills: ['React Native', 'TypeScript', 'Mobile Development']
      },
      {
        name: 'Cloud Migration',
        description: 'Migrating legacy systems to AWS cloud infrastructure',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-05-30'),
        status: 'active',
        managerId: manager._id,
        teamSize: 2,
        requiredSkills: ['AWS', 'DevOps', 'Kubernetes']
      }
    ]);
    console.log('Created projects:', projects.map(p => p.name).join(', '));

    // Create assignments
    const assignments = await Assignment.create([
      {
        engineerId: engineers[0]._id, // Sarah
        projectId: projects[0]._id, // E-commerce
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-30'),
        role: 'Tech Lead',
        allocationPercentage: 50
      },
      {
        engineerId: engineers[1]._id, // Mike
        projectId: projects[1]._id, // ML Engine
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-08-31'),
        role: 'ML Engineer',
        allocationPercentage: 60
      },
      {
        engineerId: engineers[2]._id, // Alex
        projectId: projects[3]._id, // Cloud Migration
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-05-30'),
        role: 'DevOps Lead',
        allocationPercentage: 70
      },
      {
        engineerId: engineers[0]._id, // Sarah
        projectId: projects[3]._id, // Cloud Migration
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-05-30'),
        role: 'Backend Developer',
        allocationPercentage: 30
      },
      {
        engineerId: engineers[3]._id, // Lisa
        projectId: projects[0]._id, // E-commerce
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-30'),
        role: 'Frontend Developer',
        allocationPercentage: 40
      }
    ]);
    console.log('Created assignments');

    console.log('\nSeed data created successfully!');
    console.log('\nDefault login credentials:');
    console.log('Manager: manager@example.com / password123');
    console.log('Engineers:');
    console.log('- sarah@example.com / password123 (Senior Full-stack)');
    console.log('- mike@example.com / password123 (Mid ML Engineer)');
    console.log('- alex@example.com / password123 (Senior DevOps)');
    console.log('- lisa@example.com / password123 (Junior Frontend)');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 