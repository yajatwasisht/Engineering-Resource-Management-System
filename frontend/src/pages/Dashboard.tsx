import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { DashboardStats, EngineerStats } from '../types';

const Modal: React.FC<{ title: string; isOpen: boolean; onClose: () => void }> = ({
  title,
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-lg font-bold"
          aria-label="Close modal"
        >
          ×
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};

const ManagerDashboard: React.FC<{ stats: DashboardStats }> = ({ stats }) => {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showEngineerModal, setShowEngineerModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  return (
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
            <button
              onClick={() => setShowProjectModal(true)}
              className="btn btn-primary w-full"
            >
              Create New Project
            </button>
            <button
              onClick={() => setShowEngineerModal(true)}
              className="btn btn-primary w-full"
            >
              Add Engineer
            </button>
            <button
              onClick={() => setShowAssignmentModal(true)}
              className="btn btn-primary w-full"
            >
              Manage Assignments
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Utilization</h3>
          <div className="space-y-4">
            {/* Add a chart or list showing team utilization */}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        title="Create New Project"
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
      >
        {/* Replace with your actual form */}
        <form>
          <label className="block mb-2 font-semibold" htmlFor="projectName">
            Project Name
          </label>
          <input
            id="projectName"
            type="text"
            className="w-full border border-gray-300 rounded p-2 mb-4"
            placeholder="Enter project name"
          />
          <button type="submit" className="btn btn-primary">
            Save Project
          </button>
        </form>
      </Modal>

      <Modal
        title="Add Engineer"
        isOpen={showEngineerModal}
        onClose={() => setShowEngineerModal(false)}
      >
        {/* Replace with your actual form */}
        <form>
          <label className="block mb-2 font-semibold" htmlFor="engineerName">
            Engineer Name
          </label>
          <input
            id="engineerName"
            type="text"
            className="w-full border border-gray-300 rounded p-2 mb-4"
            placeholder="Enter engineer name"
          />
          <button type="submit" className="btn btn-primary">
            Add Engineer
          </button>
        </form>
      </Modal>

      <Modal
        title="Manage Assignments"
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
      >
        {/* Replace with your actual assignment management UI */}
        <p>Assignment management UI goes here.</p>
      </Modal>
    </div>
  );
};

const EngineerDashboard: React.FC<{ stats: EngineerStats }> = ({ stats }) => {
  // No changes here, keep as is.
  return (
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
              <span
                key={skill}
                className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Projects</h3>
          <div className="space-y-4">{/* Add current projects list */}</div>
        </div>
      </div>
    </div>
  );
};

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
              <h1 className="text-xl font-bold text-gray-900">Engineering Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.name} ({user?.role})
              </span>
              <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
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
