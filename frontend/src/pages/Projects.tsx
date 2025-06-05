import React, { useEffect, useState } from 'react';
import { Project } from '../types';
import { projectService } from '../api/services';

// Sample project data (with managerId added)
const sampleProjects: Project[] = [
  {
    _id: 'proj1',
    name: 'Customer Portal Revamp',
    description: 'Redesigning and improving the user experience of the customer portal.',
    startDate: '2025-01-15T00:00:00Z',
    endDate: '2025-06-15T00:00:00Z',
    requiredSkills: ['React', 'TypeScript', 'UI/UX'],
    teamSize: 6,
    status: 'active',
    currentTeamSize: 4,
    totalAllocation: 75,
    managerId: 'mgr1',
  },
  {
    _id: 'proj2',
    name: 'Data Warehouse Migration',
    description: 'Migrating the existing data warehouse to a new cloud platform.',
    startDate: '2025-02-01T00:00:00Z',
    endDate: '2025-05-01T00:00:00Z',
    requiredSkills: ['SQL', 'ETL', 'Cloud'],
    teamSize: 5,
    status: 'planning',
    currentTeamSize: 2,
    totalAllocation: 40,
    managerId: 'mgr2',
  },
  {
    _id: 'proj3',
    name: 'Mobile App Launch',
    description: 'Building and launching the new mobile app for Android and iOS.',
    startDate: '2024-12-01T00:00:00Z',
    endDate: '2025-03-31T00:00:00Z',
    requiredSkills: ['React Native', 'iOS', 'Android'],
    teamSize: 7,
    status: 'completed',
    currentTeamSize: 7,
    totalAllocation: 100,
    managerId: 'mgr3',
  }
];

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectService.getAllProjects();
      setProjects([...response.data, ...sampleProjects]);
    } catch (error) {
      console.error('Failed to load projects:', error);
      setProjects([...sampleProjects]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.requiredSkills.some(skill =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus = !selectedStatus || project.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const allStatuses = Array.from(new Set(projects.map(p => p.status)));

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <p className="text-gray-600">Manage your projects and teams</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search projects by name, description, or skill..."
          className="border border-gray-300 rounded px-3 py-2 w-full md:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded px-3 py-2 w-full md:w-48"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {allStatuses.map(status => (
            <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div>Loading...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-gray-500">No projects found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div key={project._id} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
              <p className="text-gray-700 mt-2">{project.description}</p>

              <div className="mt-4 text-sm text-gray-600">
                <p>
                  <strong>Status:</strong> {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </p>
                <p>
                  <strong>Duration:</strong>{' '}
                  {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Team Size:</strong> {project.currentTeamSize} / {project.teamSize}
                </p>
                <p>
                  <strong>Total Allocation:</strong> {project.totalAllocation}%
                </p>
                <p>
                  <strong>Manager ID:</strong> {project.managerId}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.requiredSkills.map(skill => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-primary-500"
                  style={{ width: `${Math.min(project.totalAllocation, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
