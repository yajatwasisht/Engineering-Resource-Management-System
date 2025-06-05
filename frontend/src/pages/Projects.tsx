import React, { useEffect, useState } from 'react';
import { Project } from '../types';
import { projectService } from '../api/services';

// Sample project data (mock data)
const sampleProjects: Project[] = [
  {
    _id: 'proj1',
    name: 'AI Assistant Development',
    description: 'Build an AI assistant with NLP and ML capabilities.',
    status: 'active',
    startDate: '2025-06-01T00:00:00Z',
    endDate: '2025-09-30T00:00:00Z',
    requiredSkills: ['Python', 'Machine Learning', 'NLP'],
    teamSize: 6,
    currentTeamSize: 4,
    totalAllocation: 80
  },
  {
    _id: 'proj2',
    name: 'E-commerce Website',
    description: 'Develop a scalable e-commerce platform with React and Node.js.',
    status: 'planning',
    startDate: '2025-07-15T00:00:00Z',
    endDate: '2025-12-15T00:00:00Z',
    requiredSkills: ['React', 'Node.js', 'MongoDB'],
    teamSize: 8,
    currentTeamSize: 2,
    totalAllocation: 25
  },
  {
    _id: 'proj3',
    name: 'Mobile Banking App',
    description: 'Create a secure mobile app for online banking.',
    status: 'active',
    startDate: '2025-05-01T00:00:00Z',
    endDate: '2025-08-31T00:00:00Z',
    requiredSkills: ['React Native', 'TypeScript', 'Firebase'],
    teamSize: 5,
    currentTeamSize: 5,
    totalAllocation: 100
  },
  {
    _id: 'proj4',
    name: 'Data Analytics Dashboard',
    description: 'Develop a dashboard for real-time analytics and insights.',
    status: 'completed',
    startDate: '2024-11-01T00:00:00Z',
    endDate: '2025-03-31T00:00:00Z',
    requiredSkills: ['D3.js', 'Python', 'Data Visualization'],
    teamSize: 4,
    currentTeamSize: 4,
    totalAllocation: 100
  }
];

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectService.getAllProjects();
      // Combine fetched projects with sample projects
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
      project.requiredSkills?.some(skill =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesSkill = !selectedSkill || project.requiredSkills?.includes(selectedSkill);
    const matchesStatus = !statusFilter || project.status === statusFilter;
    return matchesSearch && matchesSkill && matchesStatus;
  });

  const allSkills = Array.from(new Set(projects.flatMap(p => p.requiredSkills || [])));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
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
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <p className="text-gray-600">Manage your engineering projects</p>
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
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
        >
          <option value="">All Skills</option>
          {allSkills.map(skill => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
        <select
          className="border border-gray-300 rounded px-3 py-2 w-full md:w-48"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
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
                  <p className="text-gray-600 line-clamp-2">{project.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
                  <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900">Required Skills</h4>
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

              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Team Size: {project.currentTeamSize || 0} / {project.teamSize}</span>
                  <span>Total Allocation: {project.totalAllocation || 0}%</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-primary-500"
                    style={{ width: `${((project.currentTeamSize || 0) / project.teamSize) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="btn btn-primary flex-1">View Details</button>
                <button className="btn btn-primary flex-1">Manage Team</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
