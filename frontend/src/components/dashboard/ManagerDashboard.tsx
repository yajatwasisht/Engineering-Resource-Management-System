import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardService } from '../../api/services';

interface Engineer {
  _id: string;
  name: string;
  currentAllocation: number;
  maxCapacity: number;
}

interface Project {
  _id: string;
  name: string;
  status: 'planning' | 'active' | 'completed';
  teamSize: number;
  currentTeamSize: number;
}

interface SkillDistribution {
  skill: string;
  count: number;
}

interface DashboardData {
  departmentUtilization: number;
  engineers: Engineer[];
  projects: Project[];
  skillDistribution: SkillDistribution[];
}

const ManagerDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getManagerDashboard();
      setDashboardData(response.data);
    } catch (err) {
      setError('Error fetching dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getUtilizationColor = (utilization: number): 'success' | 'warning' | 'danger' => {
    if (utilization > 90) return 'danger';
    if (utilization > 70) return 'warning';
    return 'success';
  };

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!dashboardData) {
    return <div className="p-6">No dashboard data available.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Engineering Department Dashboard</h1>

      {/* Department Utilization */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Department Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Utilization</span>
              <span className="text-sm text-gray-500">
                {dashboardData.departmentUtilization}%
              </span>
            </div>
            <ProgressBar
              value={dashboardData.departmentUtilization}
              max={100}
              color={getUtilizationColor(dashboardData.departmentUtilization)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Engineer Allocations */}
        <Card>
          <CardHeader>
            <CardTitle>Engineer Allocations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.engineers.map((engineer) => (
                <div key={engineer._id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{engineer.name}</span>
                    <span className="text-sm text-gray-500">
                      {engineer.currentAllocation}%
                    </span>
                  </div>
                  <ProgressBar
                    value={engineer.currentAllocation}
                    max={engineer.maxCapacity}
                    color={getUtilizationColor(engineer.currentAllocation)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Status */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.projects.map((project) => (
                <div key={project._id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{project.name}</span>
                    <Badge variant={project.status === 'active' ? 'success' : 'default'}>
                      {project.status}
                    </Badge>
                  </div>
                  <ProgressBar
                    value={project.currentTeamSize}
                    max={project.teamSize}
                    color="default"
                  />
                  <p className="text-xs text-gray-500">
                    {project.currentTeamSize} of {project.teamSize} team members
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skill Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.skillDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3182ce" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerDashboard; 