import React, { useEffect, useState } from 'react';

export interface Project {
  _id: string;
  name: string;
  description: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  requiredSkills: string[];
  teamSize: number;
  status: 'planning' | 'active' | 'completed' | string;
  currentTeamSize?: number;
  totalAllocation?: number;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Sample data to test UI rendering
  useEffect(() => {
    const sampleData: Project[] = [
      {
        _id: '1',
        name: 'Sample Project 1',
        description: 'This is a sample project for testing.',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000 * 30).toISOString(), // 30 days later
        requiredSkills: ['React', 'TypeScript'],
        teamSize: 5,
        status: 'active',
        currentTeamSize: 3,
        totalAllocation: 60,
      },
      {
        _id: '2',
        name: 'Sample Project 2',
        description: 'Another test project.',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000 * 60).toISOString(), // 60 days later
        requiredSkills: ['Node.js', 'Express'],
        teamSize: 4,
        status: 'planning',
        currentTeamSize: 1,
        totalAllocation: 25,
      },
    ];
    setProjects(sampleData);
    setLoading(false);
  }, []);

  // Uncomment and implement your API fetch here when ready
  /*
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectService.getAllProjects();
      // Convert Date objects to strings for consistency
      const projects = response.data.map((project: any) => ({
        ...project,
        startDate: typeof project.startDate === 'string' ? project.startDate : new Date(project.startDate).toISOString(),
        endDate: typeof project.endDate === 'string' ? project.endDate : new Date(project.endDate).toISOString()
      }));
      setProjects(projects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };
  */

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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <p className="text-gray-600">Manage your engineering projects</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search projects..."
          className="border border-gray-300 rounded px-3 py-2 flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded px-3 py-2"
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
                  {project.requiredSkills && project.requiredSkills.length > 0 ? (
                    project.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 italic text-xs">No skills listed</span>
                  )}
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
                    className="h-2 rounded-full bg-blue-600"
                    style={{
                      width: `${
                        ((project.currentTeamSize || 0) / project.teamSize) * 100
                      }%`
                    }}
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded flex-1 hover:bg-blue-700 transition">
                  View Details
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded flex-1 hover:bg-green-700 transition">
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
