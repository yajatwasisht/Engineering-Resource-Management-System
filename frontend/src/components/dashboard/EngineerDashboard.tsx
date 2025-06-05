import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { dashboardService } from '../../api/services';

interface Project {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  role: string;
  allocationPercentage: number;
}

interface Engineer {
  _id: string;
  name: string;
  currentAllocation: number;
  maxCapacity: number;
  skills: string[];
  projects: Project[];
}

const EngineerDashboard: React.FC = () => {
  const [engineer, setEngineer] = useState<Engineer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEngineerData();
  }, []);

  const fetchEngineerData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getEngineerDashboard();
      setEngineer(response.data);
    } catch (err) {
      setError('Error fetching engineer data');
      console.error('Error fetching engineer data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCapacityColor = (allocation: number): 'success' | 'warning' | 'danger' => {
    if (allocation > 90) return 'danger';
    if (allocation > 70) return 'warning';
    return 'success';
  };

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!engineer) {
    return <div className="p-6">No engineer data available.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome, {engineer.name}!</h1>

      {/* Summary Boxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        {/* Current Projects */}
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Current Projects</h2>
          <p className="text-2xl mt-2">{engineer.projects.length}</p>
        </div>

        {/* Current Allocation */}
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Current Allocation</h2>
          <p className="text-2xl mt-2">{engineer.currentAllocation}%</p>
        </div>

        {/* Upcoming Assignments */}
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Upcoming Assignments</h2>
          <p className="text-2xl mt-2">
            {
              engineer.projects.filter(
                (p) => new Date(p.startDate) > new Date()
              ).length
            }
          </p>
        </div>

        {/* My Skills */}
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">My Skills</h2>
          <p className="text-2xl mt-2">{engineer.skills.length}</p>
        </div>
      </div>

      {/* Capacity Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Capacity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Allocation</span>
              <span className="text-sm text-gray-500">
                {engineer.currentAllocation}%
              </span>
            </div>
            <ProgressBar
              value={engineer.currentAllocation}
              max={engineer.maxCapacity}
              color={getCapacityColor(engineer.currentAllocation)}
            />
            <p className="mt-1 text-sm text-gray-600">
              {engineer.currentAllocation}% allocated of {engineer.maxCapacity}% capacity
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {engineer.skills.map((skill) => (
              <Badge key={skill} variant="default">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {engineer.projects.map((project) => (
              <div key={project._id} className="border-b pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{project.name}</h3>
                  <Badge variant={project.allocationPercentage > 50 ? 'warning' : 'default'}>
                    {project.allocationPercentage}%
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-4">Role: {project.role}</span>
                  <span>
                    {new Date(project.startDate).toLocaleDateString()} -{' '}
                    {new Date(project.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            {engineer.projects.length === 0 && (
              <p className="text-sm text-gray-500">No active projects</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngineerDashboard;
