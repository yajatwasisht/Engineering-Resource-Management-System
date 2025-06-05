import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { DashboardStats, EngineerStats } from '../types';
import Modal from '../components/Modal';
import { projectService, userService, assignmentService } from '../services';

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

  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isEngineerModalOpen, setEngineerModalOpen] = useState(false);
  const [isAssignmentModalOpen, setAssignmentModalOpen] = useState(false);

  useEffect(() => {
    // TODO: Fetch stats
  }, [user?.role]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProjectSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const projectData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
    };
    await projectService.createProject(projectData);
    setProjectModalOpen(false);
    navigate('/projects');
  };

  const handleEngineerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const engineerData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      role: 'engineer',
    };
    await userService.signup(
      engineerData.email,
      engineerData.password,
      engineerData.name,
      engineerData.role
    );
    setEngineerModalOpen(false);
    navigate('/users');
  };

  const handleAssignmentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const assignmentData = {
      engineerId: formData.get('engineerId') as string,
      projectId: formData.get('projectId') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      allocation: parseInt(formData.get('allocation') as string, 10),
    };
    await assignmentService.createAssignment(assignmentData);
    setAssignmentModalOpen(false);
    navigate('/assignments');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Navbar */}
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
          <>
            {/* Manager Dashboard Content */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    className="btn btn-primary w-full"
                    onClick={() => setProjectModalOpen(true)}
                  >
                    Create New Project
                  </button>
                  <button
                    className="btn btn-primary w-full"
                    onClick={() => setEngineerModalOpen(true)}
                  >
                    Add Engineer
                  </button>
                  <button
                    className="btn btn-primary w-full"
                    onClick={() => setAssignmentModalOpen(true)}
                  >
                    Create Assignment
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Engineer Dashboard Content */}
            {/* You can show engineer-specific stats here */}
          </>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleProjectSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Project Name"
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            className="w-full border p-2 rounded"
          ></textarea>
          <button type="submit" className="btn btn-primary w-full">
            Create
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isEngineerModalOpen}
        onClose={() => setEngineerModalOpen(false)}
        title="Add Engineer"
      >
        <form onSubmit={handleEngineerSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Engineer Name"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            required
          />
          <button type="submit" className="btn btn-primary w-full">
            Add Engineer
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isAssignmentModalOpen}
        onClose={() => setAssignmentModalOpen(false)}
        title="Create New Assignment"
      >
        <form onSubmit={handleAssignmentSubmit} className="space-y-4">
          <input
            type="text"
            name="engineerId"
            placeholder="Engineer ID"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="projectId"
            placeholder="Project ID"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="date"
            name="startDate"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="date"
            name="endDate"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="number"
            name="allocation"
            placeholder="Allocation (%)"
            className="w-full border p-2 rounded"
            required
          />
          <button type="submit" className="btn btn-primary w-full">
            Create Assignment
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
