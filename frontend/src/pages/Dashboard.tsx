import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { DashboardStats, EngineerStats, User, Project, Assignment } from '../types';

const ManagerDashboard: React.FC<{ stats: DashboardStats }> = ({ stats }) => (
  <div className="space-y-6">
    {/* Stats Overview */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900">Total Projects</h3>
        <p className="mt-2 text-3xl font-bold text-primary-600">{stats.totalProjects}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900">Active Projects</h3>
        <p className="mt-2 text-3xl font-bold text-primary-600">{stats.activeProjects}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900">Total Engineers</h3>
        <p className="mt-2 text-3xl font-bold text-primary-600">{stats.totalEngineers}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900">Avg. Utilization</h3>
        <p className="mt-2 text-3xl font-bold text-primary-600">{stats.averageUtilization}%</p>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <button className="btn btn-primary w-full">Create New Project</button>
          <button className="btn btn-primary w-full">Add Engineer</button>
          <button className="btn btn-primary w-full">Manage Assignments</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Utilization</h3>
        <div className="space-y-4">
          {/* Add a chart or list showing team utilization */}
        </div>
      </div>
    </div>
  </div>
);

const EngineerDashboard: React.FC<{ stats: EngineerStats }> = ({ stats }) => (
  <div className="space-y-6">
    {/* Personal Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900">Current Projects</h3>
        <p className="mt-2 text-3xl font-bold text-primary-600">{stats.currentProjects}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900">Current Allocation</h3>
        <p className="mt-2 text-3xl font-bold text-primary-600">{stats.currentAllocation}%</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Assignments</h3>
        <p className="mt-2 text-3xl font-bold text-primary-600">{stats.upcomingAssignments}</p>
      </div>
    </div>

    {/* Skills and Projects */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Skills</h3>
        <div className="flex flex-wrap gap-2">
          {stats.skills.map((skill) => (
            <span key={skill} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Projects</h3>
        <div className="space-y-4">
          {/* Add current projects list */}
        </div>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [managerStats, setManagerStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    totalEngineers: 0,
    averageUtilization: 0,
  });
  const [engineerStats, setEngineerStats] = useState<EngineerStats>({
    currentProjects: 0,
    currentAllocation: 0,
    upcomingAssignments: 0,
    skills: [],
  });

  useEffect(() => {
    // Fetch dashboard stats based on user role
    // This will be implemented when we add the API integration
  }, [user?.role]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Engineering Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.name} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user?.role === 'manager' ? (
          <ManagerDashboard stats={managerStats} />
        ) : (
          <EngineerDashboard stats={engineerStats} />
        )}
      </main>
    </div>
  );
};

export default Dashboard; 