import React, { useEffect, useState } from 'react';
import { Assignment, User, Project } from '../types';
import { assignmentService, userService, projectService } from '../api/services';
import { useAuthStore } from '../store/auth';

const Assignments: React.FC = () => {
  const { user } = useAuthStore();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [engineers, setEngineers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEngineer, setSelectedEngineer] = useState('');
  const [selectedProject, setSelectedProject] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [assignmentsRes, engineersRes, projectsRes] = await Promise.all([
        assignmentService.getAllAssignments(),
        userService.getAllEngineers(),
        projectService.getAllProjects(),
      ]);

      setAssignments(assignmentsRes.data);
      setEngineers(engineersRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesEngineer = !selectedEngineer || assignment.engineerId === selectedEngineer;
    const matchesProject = !selectedProject || assignment.projectId === selectedProject;
    return matchesEngineer && matchesProject;
  });

  const getEngineerName = (engineerId: string) => {
    const engineer = engineers.find(e => e._id === engineerId);
    return engineer?.name || 'Unknown Engineer';
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p._id === projectId);
    return project?.name || 'Unknown Project';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
        <p className="text-gray-600">Manage engineer assignments to projects</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select
          className="input"
          value={selectedEngineer}
          onChange={(e) => setSelectedEngineer(e.target.value)}
        >
          <option value="">All Engineers</option>
          {engineers.map(engineer => (
            <option key={engineer._id} value={engineer._id}>{engineer.name}</option>
          ))}
        </select>

        <select
          className="input"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">All Projects</option>
          {projects.map(project => (
            <option key={project._id} value={project._id}>{project.name}</option>
          ))}
        </select>

        {user?.role === 'manager' && (
          <button className="btn btn-primary">New Assignment</button>
        )}
      </div>

      {/* Assignments List */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAssignments.map(assignment => (
            <div key={assignment._id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getEngineerName(assignment.engineerId)}
                  </h3>
                  <p className="text-gray-600">{getProjectName(assignment.projectId)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(assignment.status)}`}>
                  {assignment.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-medium">{assignment.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Allocation</p>
                  <p className="font-medium">{assignment.allocationPercentage}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="font-medium">{new Date(assignment.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="font-medium">{new Date(assignment.endDate).toLocaleDateString()}</p>
                </div>
              </div>

              {user?.role === 'manager' && (
                <div className="mt-4 flex gap-2">
                  <button className="btn btn-primary flex-1">Edit</button>
                  <button className="btn btn-danger flex-1">Remove</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Assignments; 