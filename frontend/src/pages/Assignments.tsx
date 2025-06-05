import React, { useEffect, useState } from 'react';
import { Assignment, User, Project } from '../types';
import { useAuthStore } from '../store/auth';

// Sample seed data for engineers (users)
const sampleEngineers: User[] = [
  { _id: 'eng1', name: 'Sarah', role: 'engineer' },
  { _id: 'eng2', name: 'Mike', role: 'engineer' },
  { _id: 'eng3', name: 'Alex', role: 'engineer' },
  { _id: 'eng4', name: 'Lisa', role: 'engineer' },
];

// Sample seed data for projects
const sampleProjects: Project[] = [
  { _id: 'proj1', name: 'E-commerce Platform', description: '', startDate: '2024-01-01', endDate: '2024-06-30', requiredSkills: [], teamSize: 5, status: 'active', currentTeamSize: 4, totalAllocation: 80, managerId: 'mgr1' },
  { _id: 'proj2', name: 'ML Engine', description: '', startDate: '2024-02-01', endDate: '2024-08-31', requiredSkills: [], teamSize: 4, status: 'planning', currentTeamSize: 2, totalAllocation: 60, managerId: 'mgr2' },
  { _id: 'proj3', name: 'Mobile App Redesign', description: '', startDate: '2023-07-01', endDate: '2023-12-31', requiredSkills: [], teamSize: 3, status: 'completed', currentTeamSize: 3, totalAllocation: 100, managerId: 'mgr3' },
  { _id: 'proj4', name: 'Cloud Migration', description: '', startDate: '2024-01-15', endDate: '2024-05-30', requiredSkills: [], teamSize: 6, status: 'active', currentTeamSize: 5, totalAllocation: 90, managerId: 'mgr4' },
];

// Sample seed data for assignments
const sampleAssignments: Assignment[] = [
  {
    _id: 'assign1',
    engineerId: 'eng1', // Sarah
    projectId: 'proj1', // E-commerce
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    role: 'Tech Lead',
    allocationPercentage: 50,
    status: 'active',
  },
  {
    _id: 'assign2',
    engineerId: 'eng2', // Mike
    projectId: 'proj2', // ML Engine
    startDate: '2024-02-01',
    endDate: '2024-08-31',
    role: 'ML Engineer',
    allocationPercentage: 60,
    status: 'pending',
  },
  {
    _id: 'assign3',
    engineerId: 'eng3', // Alex
    projectId: 'proj4', // Cloud Migration
    startDate: '2024-01-15',
    endDate: '2024-05-30',
    role: 'DevOps Lead',
    allocationPercentage: 70,
    status: 'active',
  },
  {
    _id: 'assign4',
    engineerId: 'eng1', // Sarah
    projectId: 'proj4', // Cloud Migration
    startDate: '2024-01-15',
    endDate: '2024-05-30',
    role: 'Backend Developer',
    allocationPercentage: 30,
    status: 'active',
  },
  {
    _id: 'assign5',
    engineerId: 'eng4', // Lisa
    projectId: 'proj1', // E-commerce
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    role: 'Frontend Developer',
    allocationPercentage: 40,
    status: 'completed',
  },
];

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
      // Replace below with real API calls if available, fallback to sample data
      // const [assignmentsRes, engineersRes, projectsRes] = await Promise.all([
      //   assignmentService.getAllAssignments(),
      //   userService.getAllEngineers(),
      //   projectService.getAllProjects(),
      // ]);
      // setAssignments(assignmentsRes.data);
      // setEngineers(engineersRes.data);
      // setProjects(projectsRes.data);

      // For now, use sample data:
      setAssignments(sampleAssignments);
      setEngineers(sampleEngineers);
      setProjects(sampleProjects);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesEngineer = !selectedEngineer || assignment.engineerId === selectedEngineer;
    const matchesProject = !selectedProject || assignment.projectId === selectedProject;
    return matchesEngineer && matchesProject;
  });

  const getEngineerName = (engineerId: string) => {
    const engineer = engineers.find((e) => e._id === engineerId);
    return engineer?.name || 'Unknown Engineer';
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p._id === projectId);
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
      <div className="mb-6 flex gap-4 flex-wrap">
        <select
          className="border border-gray-300 rounded px-3 py-2"
          value={selectedEngineer}
          onChange={(e) => setSelectedEngineer(e.target.value)}
        >
          <option value="">All Engineers</option>
          {engineers.map((engineer) => (
            <option key={engineer._id} value={engineer._id}>
              {engineer.name}
            </option>
          ))}
        </select>

        <select
          className="border border-gray-300 rounded px-3 py-2"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">All Projects</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>

        {user?.role === 'manager' && (
          <button className="btn btn-primary ml-auto">New Assignment</button>
        )}
      </div>

      {/* Assignments List */}
      {loading ? (
        <div>Loading...</div>
      ) : filteredAssignments.length === 0 ? (
        <div className="text-gray-500">No assignments found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAssignments.map((assignment) => (
            <div key={assignment._id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getEngineerName(assignment.engineerId)}
                  </h3>
                  <p className="text-gray-600">{getProjectName(assignment.projectId)}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(
                    assignment.status
                  )}`}
                >
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
