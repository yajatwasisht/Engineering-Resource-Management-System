import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface SkillCoverage {
  skill: string;
  engineerCount: number;
  requiredCount: number;
  gap: number;
}

interface SkillGapData {
  missingSkills: string[];
  criticalSkills: string[];
  skillCoverage: SkillCoverage[];
}

const SkillGapAnalysis: React.FC = () => {
  const [skillGapData, setSkillGapData] = useState<SkillGapData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkillGapData();
  }, []);

  const fetchSkillGapData = async () => {
    try {
      const response = await fetch('/api/analysis/skill-gaps');
      const data = await response.json();
      setSkillGapData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching skill gap data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading skill gap analysis...</div>;
  }

  if (!skillGapData) {
    return <div>No skill gap data available.</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Skill Gap Analysis</h2>

      {/* Critical Skills Alert */}
      {skillGapData.criticalSkills.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded">
          <h3 className="font-semibold text-yellow-700">Critical Skills</h3>
          <p className="text-yellow-600">
            The following skills need more engineers:{' '}
            {skillGapData.criticalSkills.join(', ')}
          </p>
        </div>
      )}

      {/* Missing Skills Alert */}
      {skillGapData.missingSkills.length > 0 && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 rounded">
          <h3 className="font-semibold text-red-700">Missing Skills</h3>
          <p className="text-red-600">
            No engineers available for: {skillGapData.missingSkills.join(', ')}
          </p>
        </div>
      )}

      {/* Skill Coverage Chart */}
      <div className="h-[400px] mt-6">
        <h3 className="text-lg font-semibold mb-4">Skill Coverage</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={skillGapData.skillCoverage}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="skill" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="engineerCount"
              name="Available Engineers"
              fill="#3182ce"
            />
            <Bar
              dataKey="requiredCount"
              name="Required Engineers"
              fill="#e53e3e"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Skill Coverage Table */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Detailed Skill Coverage</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skill
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Required
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gap
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {skillGapData.skillCoverage.map((skill, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{skill.skill}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {skill.engineerCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {skill.requiredCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{skill.gap}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        skill.gap > 0
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {skill.gap > 0 ? 'Shortage' : 'Sufficient'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SkillGapAnalysis; 