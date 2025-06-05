import React, { useState } from 'react';

type User = {
  _id: string;
  name: string;
  role: 'engineer' | 'manager' | string;
  email: string;
  employmentType: string;
  maxCapacity: number;
};

type Project = {
  _id: string;
  name: string;
  description?: string;
};

type Assignment = {
  _id: string;
  engineerId: string;
  projectId: string;
  startDate: string;
  endDate: string;
  role: string;
  allocationPercentage: number;
  status: 'pending' | 'active' | 'completed';
};

const Assignments: React.FC = () => {
  // Sample data - hardcoded inside component
  const engineers: User[] = [
    {
      _id: '1',
      name: 'Sarah',
      role: 'engineer',
      email: 'sarah@example.com',
      employmentType: 'full-time',
      maxCapacity: 100,
    },
    {
      _id: '2',
      name: 'Mike',
      role: 'engineer',
      email: 'mike@example.com',
      employmentType: 'full-time',
      maxCapacity: 100,
    },
    {
      _id: '3',
      name: 'Alex',
      role: 'engineer',
      email: 'alex@example.com',
      employmentType: 'contract',
      maxCapacity: 80,
    },
    {
      _id: '4',
      name: 'Lisa',
      role: 'engineer',
      email: 'lisa@example.com',
      employmentType: 'part-time',
      maxCapacity: 60,
    },
  ];

  const projects: Project[] = [
    { _id: 'p1', name: 'E-commerce Platform' },
    { _id: 'p2', name: 'Machine Learning Engine' },
    { _id: 'p3', name: 'Mobile App Revamp' },
    { _id: 'p4', name: 'Cloud Migration' },
  ];

  const assignments: Assignment[] = [
    {
      _id: 'a1',
      engineerId: '1',
      projectId: 'p1',
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      role: 'Tech Lead',
      allocationPercentage: 50,
      status: 'active',
    },
    {
      _id: 'a2',
      engineerId: '2',
      projectId: 'p2',
      startDate: '2024-02-01',
      endDate: '2024-08-31',
      role: 'ML Engineer',
      allocationPercentage: 60,
      status: 'pending',
    },
    {
      _id: 'a3',
      engineerId: '3',
      projectId: 'p4',
      startDate: '2024-01-15',
      endDate: '2024-05-30',
      role: 'DevOps Lead',
      allocationPercentage: 70,
      status: 'active',
    },
    {
      _id: 'a4',
      engineerId: '1',
      projectId: 'p4',
      startDate: '2024-01-15',
      endDate: '2024-05-30',
      role: 'Backend Developer',
      allocationPercentage: 30,
      status: 'completed',
    },
    {
      _id: 'a5',
      engineerId: '4',
      projectId: 'p1',
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      role: 'Frontend Developer',
      allocationPercentage: 40,
      status: 'active',
    },
  ];

  // Helpers to get names by IDs
  const getEngineerName = (id: string) => engineers.find(e => e._id === id)?.name || 'Unknown';
  const getProjectName = (id: string) => projects.find(p => p._id === id)?.name || 'Unknown';

  // Status color helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Assignments</h1>

      <div className="space-y-6">
        {assignments.map(assignment => (
          <div key={assignment._id} className="border rounded-lg p-5 shadow-md bg-white">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold">
                {getEngineerName(assignment.engineerId)}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(assignment.status)}`}
              >
                {assignment.status}
              </span>
            </div>
            <p className="text-gray-600 mb-1"><strong>Project:</strong> {getProjectName(assignment.projectId)}</p>
            <p className="text-gray-600 mb-1"><strong>Role:</strong> {assignment.role}</p>
            <p className="text-gray-600 mb-1"><strong>Allocation:</strong> {assignment.allocationPercentage}%</p>
            <p className="text-gray-600"><strong>Duration:</strong> {new Date(assignment.startDate).toLocaleDateString()} - {new Date(assignment.endDate).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assignments;
