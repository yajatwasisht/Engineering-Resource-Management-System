import React, { useEffect, useState } from 'react';
import { Project } from '../types';
import { projectService } from '../api/services';

// Sample project data
const sampleProjects: Project[] = [
  {
    _id: 'proj1',
    name: 'Project Apollo',
    description: 'Develop a new cloud infrastructure platform.',
    startDate: '2024-01-10',
    endDate: '2024-12-31',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes'],
    teamSize: 5,
    status: 'active',
    currentTeamSize: 3,
    totalAllocation: 60,
    managerId: 'mgr1'
  },
  {
    _id: 'proj2',
    name: 'Data Insights',
    description: 'Build a data analytics dashboard.',
    startDate: '2024-03-01',
    endDate: '2024-09-30',
    requiredSkills: ['Python', 'React', 'SQL'],
    teamSize: 4,
    status: 'planning',
    currentTeamSize: 0,
    totalAllocation: 0,
    managerId: 'mgr2'
  },
  {
    _id: 'proj3',
    name: 'Mobile Revamp',
    description: 'Redesign the mobile app for better UX.',
    startDate: '2023-07-15',
    endDate: '2023-12-15',
    requiredSkills: ['React Native', 'UI/UX'],
    teamSize: 3,
    status: 'completed',
    currentTeamSize: 3,
    totalAllocation: 100,
    managerId: 'mgr3'
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
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        <p className="text-gray-600">Manage your projects</p>
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
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-gray-600">{project.description}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    project.status === 'completed' ? 'bg-green-100 text-green-800' :
                    project.status === 'active' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <p>
                  Duration: {project.startDate} - {project.endDate}
                </p>
                <p>
                  Team: {project.currentTeamSize} / {project.teamSize}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.requiredSkills.map(skill => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-primary-500"
                  style={{ width: `${Math.min(project.totalAllocation ?? 0, 100)}%` }}
                />
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Allocation: {project.totalAllocation ?? 0}% / 100%
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
