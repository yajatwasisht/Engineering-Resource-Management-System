export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'manager' | 'engineer';
  skills?: string[];
  seniority?: 'junior' | 'mid' | 'senior';
  employmentType: 'full-time' | 'part-time';
  maxCapacity: number; // 100 for full-time, 50 for part-time
  department?: string;
  currentAllocation?: number; // Calculated from assignments
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  requiredSkills: string[];
  teamSize: number;
  status: 'planning' | 'active' | 'completed';
  managerId: string;
  currentTeamSize?: number; // Current number of engineers assigned
  totalAllocation?: number; // Sum of all assignment percentages
}

export interface Assignment {
  _id: string;
  engineerId: string;
  projectId: string;
  allocationPercentage: number;
  startDate: string;
  endDate: string;
  role: string;
  status: 'pending' | 'active' | 'completed';
  engineer?: User;
  project?: Project;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalEngineers: number;
  averageUtilization: number;
}

export interface EngineerStats {
  currentProjects: number;
  currentAllocation: number;
  upcomingAssignments: number;
  skills: string[];
}

export interface ProjectStats {
  totalEngineers: number;
  averageAllocation: number;
  requiredSkills: string[];
  startDate: string;
  endDate: string;
}

export interface ApiError {
  status: string;
  message: string;
} 