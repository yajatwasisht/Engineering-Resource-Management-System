# Engineering Resource Management System (ERMS)

## Overview

The Engineering Resource Management System (ERMS) is a comprehensive full-stack application designed to streamline the management of engineering resources, project assignments, and team utilization. It provides real-time insights into department capacity, skill distribution, and project allocations.

## Table of Contents

1. [Core Features](#core-features)
2. [System Architecture](#system-architecture)
3. [Technical Implementation](#technical-implementation)
4. [Data Models](#data-models)
5. [Setup Guide](#setup-guide)
6. [API Reference](#api-reference)
7. [User Guide](#user-guide)
8. [Development Guide](#development-guide)
9. [Security Features](#security-features)
10. [Deployment Guide](#deployment-guide)

## Core Features

### 1. User Management System
- **Role-Based Access Control**
  - Manager role: Full access to resource allocation and department overview
  - Engineer role: Access to personal assignments and capacity management
- **Profile Management**
  - Skill tracking and updates
  - Capacity management (full-time/part-time)
  - Department and seniority tracking

### 2. Project Management
- **Project Lifecycle Management**
  - Project creation and configuration
  - Team assembly and skill matching
  - Timeline tracking and milestone management
- **Resource Allocation**
  - Smart allocation suggestions based on skills and capacity
  - Conflict detection for over-allocation
  - Real-time availability tracking

### 3. Analytics Dashboard
- **Manager View**
  - Department-wide utilization metrics
  - Skill distribution visualization
  - Project status overview
  - Resource allocation heat maps
- **Engineer View**
  - Personal utilization tracking
  - Project assignment timeline
  - Skill development tracking
  - Capacity management tools

## System Architecture

### Frontend Architecture
```
frontend/
├── src/
│   ├── api/                 # API integration layer
│   │   ├── client.ts       # Axios configuration
│   │   └── services.ts     # API service definitions
│   ├── components/         # React components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── projects/       # Project management
│   │   ├── users/         # User management
│   │   └── ui/            # Reusable UI components
│   ├── store/             # State management
│   │   ├── auth.ts        # Authentication state
│   │   ├── projects.ts    # Project state
│   │   └── users.ts       # User state
│   └── types/             # TypeScript definitions
```

### Backend Architecture
```
backend/
├── src/
│   ├── controllers/        # Business logic
│   │   ├── auth.ts        # Authentication
│   │   ├── projects.ts    # Project management
│   │   └── dashboard.ts   # Dashboard data
│   ├── models/            # Database schemas
│   │   ├── User.ts        # User model
│   │   ├── Project.ts     # Project model
│   │   └── Assignment.ts  # Assignment model
│   ├── middleware/        # Custom middleware
│   │   ├── auth.ts        # JWT authentication
│   │   └── validation.ts  # Request validation
│   └── routes/            # API routes
```

## Technical Implementation

### Frontend Stack
- **React 18 with TypeScript**
  - Modern functional components with hooks
  - Custom hooks for business logic
  - TypeScript for type safety

- **State Management**
  - Zustand for global state
  - React Query for API cache
  - Context for theme/auth

- **UI Components**
  - Tailwind CSS for styling
  - Radix UI for accessible components
  - Recharts for data visualization

### Backend Stack
- **Node.js with Express**
  - TypeScript for type safety
  - Express middleware architecture
  - Error handling middleware

- **Database**
  - MongoDB with Mongoose
  - Indexed collections
  - Aggregation pipelines

- **Authentication**
  - JWT-based auth
  - Role-based access control
  - Password hashing with bcrypt

## Data Models

### User Model
\`\`\`typescript
interface IUser {
  email: string;
  name: string;
  role: 'engineer' | 'manager';
  department: string;
  seniority?: 'junior' | 'mid' | 'senior';
  skills?: string[];
  employmentType: 'full-time' | 'part-time';
  maxCapacity: number;
  currentAllocation: number;
}
\`\`\`

### Project Model
\`\`\`typescript
interface IProject {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'completed';
  managerId: string;
  teamSize: number;
  requiredSkills: string[];
}
\`\`\`

### Assignment Model
\`\`\`typescript
interface IAssignment {
  engineerId: string;
  projectId: string;
  startDate: Date;
  endDate: Date;
  role: string;
  allocationPercentage: number;
}
\`\`\`

## Setup Guide

### Prerequisites
1. Node.js (v16+)
2. MongoDB (v4.4+)
3. npm or yarn
4. Git

### Installation Steps

1. **Clone and Install Dependencies**
   ```bash
   git clone https://github.com/yourusername/engineer-mngmnt.git
   cd engineer-mngmnt
   npm run install:all
   ```

2. **Environment Configuration**
   ```bash
   # Backend configuration
   cd backend
   cp .env.example .env

   # Update .env with:
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/engineer-management
   JWT_SECRET=your-secret-key
   ```

3. **Database Setup**
   ```bash
   # Seed the database
   npm run seed
   ```

4. **Start Development Servers**
   ```bash
   # From root directory
   npm run dev
   ```

### Default Accounts
- **Manager Account**
  - Email: manager@example.com
  - Password: password123

- **Engineer Accounts**
  - sarah@example.com / password123 (Senior Full-stack)
  - mike@example.com / password123 (Mid ML Engineer)
  - alex@example.com / password123 (Senior DevOps)
  - lisa@example.com / password123 (Junior Frontend)

## API Reference

### Authentication Endpoints
- **POST /api/auth/login**
  ```typescript
  body: { email: string, password: string }
  response: { token: string, user: IUser }
  ```

- **POST /api/auth/register**
  ```typescript
  body: {
    email: string,
    password: string,
    name: string,
    role: string,
    department: string,
    seniority?: string,
    skills?: string[]
  }
  response: { token: string, user: IUser }
  ```

### Dashboard Endpoints
- **GET /api/dashboard/manager**
  ```typescript
  response: {
    departmentUtilization: number,
    engineers: IEngineer[],
    projects: IProject[],
    skillDistribution: ISkillData[]
  }
  ```

- **GET /api/dashboard/engineer**
  ```typescript
  response: {
    currentAllocation: number,
    maxCapacity: number,
    projects: IAssignment[],
    skills: string[]
  }
  ```

### Project Management Endpoints
- **GET /api/projects**
- **POST /api/projects**
- **PUT /api/projects/:id**
- **DELETE /api/projects/:id**
- **GET /api/projects/:id/assignments**

### Resource Management Endpoints
- **GET /api/engineers**
- **GET /api/engineers/:id/assignments**
- **POST /api/assignments**
- **PUT /api/assignments/:id**

## Development Guide

### Code Organization
- Use feature-based organization
- Follow SOLID principles
- Implement proper error handling
- Write comprehensive tests

### Testing Strategy
1. **Unit Tests**
   - Controllers and services
   - React components
   - Utility functions

2. **Integration Tests**
   - API endpoints
   - Database operations
   - Authentication flow

3. **E2E Tests**
   - Critical user flows
   - Dashboard functionality
   - Project management

### Code Style
- ESLint configuration
- Prettier for formatting
- TypeScript strict mode
- Conventional commits

## Security Features

1. **Authentication**
   - JWT-based authentication
   - Token expiration
   - Refresh token mechanism

2. **Authorization**
   - Role-based access control
   - Resource-level permissions
   - API route protection

3. **Data Protection**
   - Password hashing
   - Input validation
   - XSS protection
   - CORS configuration

## Deployment Guide

### Backend Deployment
1. Build TypeScript:
   ```bash
   cd backend
   npm run build
   ```

2. Environment setup:
   - Configure production MongoDB
   - Set secure JWT secret
   - Configure CORS origins

3. Start server:
   ```bash
   npm start
   ```

### Frontend Deployment
1. Build application:
   ```bash
   cd frontend
   npm run build
   ```

2. Configure environment:
   - Set API endpoint
   - Configure base path
   - Set up analytics

3. Deploy static files:
   - Upload to CDN
   - Configure caching
   - Set up routing

## Support and Maintenance

### Troubleshooting
- Check MongoDB connection
- Verify JWT token validity
- Monitor server logs
- Check browser console

### Performance Optimization
- Database indexing
- API response caching
- Frontend bundle optimization
- Image optimization

### Monitoring
- Server health checks
- Database performance
- API response times
- Error tracking

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

This project is licensed under the MIT License. See LICENSE file for details. 