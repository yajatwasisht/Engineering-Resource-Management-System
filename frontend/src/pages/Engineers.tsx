import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { userService } from '../api/services';

// Sample engineer data from seed file
const sampleEngineers: User[] = [
  {
    _id: 'sample-sarah',
    email: 'sarah@example.com',
    name: 'Sarah Chen',
    role: 'engineer',
    department: 'Engineering',
    seniority: 'senior',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    employmentType: 'full-time',
    maxCapacity: 100,
    currentAllocation: 70,
  },
  {
    _id: 'sample-mike',
    email: 'mike@example.com',
    name: 'Mike Johnson',
    role: 'engineer',
    department: 'Data Science',
    seniority: 'mid',
    skills: ['Python', 'Machine Learning', 'Data Science'],
    employmentType: 'full-time',
    maxCapacity: 100,
    currentAllocation: 100,
  },
  {
    _id: 'sample-alex',
    email: 'alex@example.com',
    name: 'Alex Rodriguez',
    role: 'engineer',
    department: 'Engineering',
    seniority: 'junior',
    skills: ['JavaScript', 'React', 'HTML', 'CSS'],
    employmentType: 'part-time',
    maxCapacity: 50,
    currentAllocation: 40,
  },
  {
    _id: 'sample-lisa',
    email: 'lisa@example.com',
    name: 'Lisa Wong',
    role: 'engineer',
    department: 'DevOps',
    seniority: 'senior',
    skills: ['Java', 'Spring Boot', 'DevOps', 'Kubernetes'],
    employmentType: 'full-time',
    maxCapacity: 100,
    currentAllocation: 80,
  },
];

const Engineers: React.FC = () => {
  const [engineers, setEngineers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  useEffect(() => {
    loadEngineers();
  }, []);

  const loadEngineers = async () => {
    try {
      const response = await userService.getAllEngineers();
      setEngineers(response.data);
    } catch (error) {
      console.error('Failed to load engineers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEngineers = engineers.filter(engineer => {
    const matchesSearch = engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         engineer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill = !selectedSkill || engineer.skills?.includes(selectedSkill);
    return matchesSearch && matchesSkill;
  });

  const allSkills = Array.from(new Set(engineers.flatMap(e => e.skills || [])));

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Engineers</h1>
        <p className="text-gray-600">Manage your engineering team</p>
      </div>

      {/* Sample Engineers Showcase */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Sample Engineers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleEngineers.map(engineer => (
            <div key={engineer._id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900">{engineer.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  (engineer.currentAllocation || 0) >= (engineer.maxCapacity || 100)
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {engineer.currentAllocation || 0}% Allocated
                </span>
              </div>
              <p className="text-gray-600 mb-2">{engineer.department} • {engineer.seniority}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {engineer.skills?.map(skill => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    (engineer.currentAllocation || 0) >= (engineer.maxCapacity || 100)
                      ? 'bg-red-500'
                      : 'bg-primary-500'
                  }`}
                  style={{ width: `${((engineer.currentAllocation || 0) / (engineer.maxCapacity || 100)) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search engineers..."
          className="input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="input"
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
        >
          <option value="">All Skills</option>
          {allSkills.map(skill => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
      </div>

      {/* Engineers Grid */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEngineers.map(engineer => (
            <div key={engineer._id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{engineer.name}</h3>
                  <p className="text-gray-600">{engineer.email}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  (engineer.currentAllocation || 0) >= (engineer.maxCapacity || 100)
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {engineer.currentAllocation || 0}% Allocated
                </span>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  {engineer.employmentType} • {engineer.seniority}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {engineer.skills?.map(skill => (
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
                    className={`h-2 rounded-full ${
                      (engineer.currentAllocation || 0) >= (engineer.maxCapacity || 100)
                        ? 'bg-red-500'
                        : 'bg-primary-500'
                    }`}
                    style={{ width: `${((engineer.currentAllocation || 0) / (engineer.maxCapacity || 100)) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  Capacity: {engineer.currentAllocation || 0}% / {engineer.maxCapacity || 100}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Engineers;
