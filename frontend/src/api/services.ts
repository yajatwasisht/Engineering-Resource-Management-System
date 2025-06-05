import client from './client';
import { User, Project, Assignment, DashboardStats, EngineerStats } from '../types';

// Auth Services
export const authService = {
  login: (email: string, password: string) =>
    client.post('/auth/login', { email, password }),
  
  signup: (email: string, password: string, name: string, role: string) =>
    client.post('/auth/signup', { email, password, name, role }),
  
  getCurrentUser: () => client.get('/auth/me'),
};

// User Services
export const userService = {
  getAllEngineers: () => client.get<User[]>('/users/engineers'),
  
  updateUser: (userId: string, data: Partial<User>) =>
    client.put(`/users/${userId}`, data),
  
  updateSkills: (userId: string, skills: string[]) =>
    client.put(`/users/${userId}/skills`, { skills }),
  
  getEngineerStats: (userId: string) =>
    client.get<EngineerStats>(`/users/${userId}/stats`),
};

// Project Services
export const projectService = {
  getAllProjects: () => client.get<Project[]>('/projects'),
  
  getProject: (id: string) => client.get<Project>(`/projects/${id}`),
  
  createProject: (data: Omit<Project, '_id'>) =>
    client.post('/projects', data),
  
  updateProject: (id: string, data: Partial<Project>) =>
    client.put(`/projects/${id}`, data),
  
  deleteProject: (id: string) =>
    client.delete(`/projects/${id}`),
  
  searchProjects: (query: string) =>
    client.get<Project[]>(`/projects/search?q=${query}`),
};

// Assignment Services
export const assignmentService = {
  getAllAssignments: () => client.get<Assignment[]>('/assignments'),
  
  getAssignment: (id: string) =>
    client.get<Assignment>(`/assignments/${id}`),
  
  createAssignment: (data: Omit<Assignment, '_id'>) =>
    client.post('/assignments', data),
  
  updateAssignment: (id: string, data: Partial<Assignment>) =>
    client.put(`/assignments/${id}`, data),
  
  deleteAssignment: (id: string) =>
    client.delete(`/assignments/${id}`),
  
  getEngineerAssignments: (engineerId: string) =>
    client.get<Assignment[]>(`/assignments/engineer/${engineerId}`),
  
  getProjectAssignments: (projectId: string) =>
    client.get<Assignment[]>(`/assignments/project/${projectId}`),
};

// Dashboard Services
export const dashboardService = {
  getManagerDashboard: () =>
    client.get<DashboardStats>('/dashboard/manager'),
  
  getEngineerDashboard: () =>
    client.get<EngineerStats>('/dashboard/engineer'),
  
  getTeamUtilization: () =>
    client.get('/dashboard/utilization'),
  
  getUpcomingAssignments: () =>
    client.get('/dashboard/upcoming-assignments'),
  };
  
// Analytics Services
export const analyticsService = {
  getSkillsDistribution: () =>
    client.get('/analytics/skills'),
  
  getProjectStatusDistribution: () =>
    client.get('/analytics/project-status'),
  
  getTeamUtilizationTrend: () =>
    client.get('/analytics/utilization-trend'),
}; 
