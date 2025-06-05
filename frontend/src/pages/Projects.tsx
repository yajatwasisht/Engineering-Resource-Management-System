import React, { useEffect, useState } from 'react';
import { Project } from '../types';
import { projectService } from '../api/services';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      // 👇 Replace this with dummy data temporarily if API fails
      // const dummyProjects: Project[] = [
      //   {
      //     _id: '1',
      //     name: 'Test Project',
      //     description: 'This is a test project.',
      //     status: 'active',
      //     startDate: '2024-06-01',
      //     endDate: '2024-07-01',
      //     requiredSkills: ['React', 'TypeScript'],
      //     teamSize: 5,
      //     currentTeamSize: 2,
      //     totalAllocation: 40,
      //   },
      // ];
      // setProjects(dummyProjects);

      const response = await projectService.getAllProjects();
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to load projects:', error);
      setError('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <p className="text-gray-600">Manage your engineering projects</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search projects..."
          className="border rounded px-3 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div>Loading projects...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : filteredProjects.length === 0 ? (
        <div>No projects found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project._id} className="bg-white rounded-xl shadow-lg p-6 border">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-gray-600 line-clamp-2">{project.description}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(
                    project.status
                  )}`}
                >
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
                  {project.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    Team Size: {project.currentTeamSize || 0} / {project.teamSize}
                  </span>
                  <span>Total Allocation: {project.totalAllocation || 0}%</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-green-500"
                    style={{
                      width: `${((project.currentTeamSize || 0) / project.teamSize) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex-1">
                  View Details
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex-1">
                  Manage Team
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
