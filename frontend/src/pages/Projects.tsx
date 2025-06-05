import React, { useEffect, useState } from 'react';
import { Project } from '../types';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  // Mock Data (from seed file)
  const sampleProjects: Project[] = [
    {
      _id: '1',
      name: 'E-commerce Platform Redesign',
      description: 'Modernize the e-commerce platform with React and TypeScript',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-08-31'),
      requiredSkills: ['React', 'TypeScript', 'Node.js'],
      teamSize: 3,
      status: 'active',
      managerId: 'manager1',
      currentTeamSize: 2,
      totalAllocation: 60
    },
    {
      _id: '2',
      name: 'ML Recommendation Engine',
      description: 'Build an AI-powered product recommendation system',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-09-30'),
      requiredSkills: ['Python', 'Machine Learning', 'Data Science'],
      teamSize: 2,
      status: 'planning',
      managerId: 'manager1',
      currentTeamSize: 1,
      totalAllocation: 50
    },
    {
      _id: '3',
      name: 'Mobile App Development',
      description: 'Develop a cross-platform mobile app using React Native',
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-10-31'),
      requiredSkills: ['React', 'JavaScript', 'Mobile Development'],
      teamSize: 2,
      status: 'active',
      managerId: 'manager1',
      currentTeamSize: 2,
      totalAllocation: 100
    },
    {
      _id: '4',
      name: 'Cloud Infrastructure Migration',
      description: 'Migrate on-premise systems to cloud infrastructure',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-12-31'),
      requiredSkills: ['DevOps', 'Kubernetes', 'AWS'],
      teamSize: 2,
      status: 'planning',
      managerId: 'manager1',
      currentTeamSize: 0,
      totalAllocation: 0
    }
  ];

  const loadProjects = async () => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProjects(sampleProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <p className="text-gray-600">Manage your engineering projects</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search projects..."
          className="input border border-gray-300 rounded px-3 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="input border border-gray-300 rounded px-3 py-2"
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project._id} className="bg-white rounded-xl shadow-lg p-6">
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
                      className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs"
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
                    className="h-2 rounded-full bg-primary-500"
                    style={{
                      width: `${(
                        ((project.currentTeamSize || 0) / project.teamSize) *
                        100
                      ).toFixed(2)}%`
                    }}
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
