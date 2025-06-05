import React, { useEffect, useState } from 'react';
import { Project } from '../types';
// import { projectService } from '../api/services'; // Uncomment when you add real API calls

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
    totalAllocation: 75
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
    totalAllocation: 40
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
    totalAllocation: 100
  }
];

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    // Uncomment this and implement projectService.getAllProjects() for real API
    // const loadProjects = async () => {
    //   try {
    //     const response = await projectService.getAllProjects();
    //     setProjects(response.data);
    //   } catch (error) {
    //     console.error('Failed to load projects:', error);
    //     setProjects(sampleProjects);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // loadProjects();

    // For now, just load sample projects
    setProjects(sampleProjects);
    setLoading(false);
  }, []);

  const filteredProjects = projects.filter(proj => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      proj.name.toLowerCase().includes(searchLower) ||
      proj.description.toLowerCase().includes(searchLower) ||
      proj.requiredSkills.some(skill => skill.toLowerCase().includes(searchLower));
    const matchesStatus = !statusFilter || proj.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClasses = (status: string) => {
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

  const getProgressBarColor = (allocation?: number) => {
    if (!allocation) return 'bg-gray-300';
    if (allocation >= 100) return 'bg-red-600';
    if (allocation >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <p className="text-gray-600">Manage your engineering projects</p>
      </div>

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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-gray-500">No projects found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project._id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-gray-600 line-clamp-3">{project.description}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusBadgeClasses(
                    project.status
                  )}`}
                >
                  {project.status}
                </span>
              </div>

              <div className="mt-4 text-sm text-gray-600 flex justify-between">
                <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
                <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
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
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${getProgressBarColor(project.totalAllocation)} h-2 rounded-full`}
                    style={{
                      width: `${Math.min(project.totalAllocation || 0, 100)}%`
                    }}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  Team: {project.currentTeamSize || 0} / {project.teamSize} members • Allocation: {project.totalAllocation || 0}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
