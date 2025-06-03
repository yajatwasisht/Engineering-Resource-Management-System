import mongoose from 'mongoose';
import User from '../models/User';
import Project from '../models/Project';

interface SkillGapAnalysis {
  missingSkills: string[];
  criticalSkills: string[];
  skillCoverage: {
    skill: string;
    engineerCount: number;
    requiredCount: number;
    gap: number;
  }[];
}

interface TeamSkillDistribution {
  skill: string;
  engineerCount: number;
  engineers: Array<{
    name: string;
    seniority: string;
    availability: number;
  }>;
}

/**
 * Analyze skill gaps across all active projects
 */
export async function analyzeSkillGaps(): Promise<SkillGapAnalysis> {
  // Get all active projects and their required skills
  const projects = await Project.find({ status: 'active' });
  const engineers = await User.find({ role: 'engineer' });

  // Collect all required skills and count how many times each is needed
  const skillRequirements = new Map<string, number>();
  projects.forEach(project => {
    project.requiredSkills.forEach(skill => {
      skillRequirements.set(skill, (skillRequirements.get(skill) || 0) + 1);
    });
  });

  // Count available engineers per skill
  const skillAvailability = new Map<string, number>();
  engineers.forEach(engineer => {
    engineer.skills?.forEach(skill => {
      skillAvailability.set(skill, (skillAvailability.get(skill) || 0) + 1);
    });
  });

  // Analyze gaps
  const skillCoverage = Array.from(skillRequirements.entries()).map(([skill, requiredCount]) => ({
    skill,
    engineerCount: skillAvailability.get(skill) || 0,
    requiredCount,
    gap: requiredCount - (skillAvailability.get(skill) || 0)
  }));

  // Identify missing and critical skills
  const missingSkills = skillCoverage
    .filter(s => s.engineerCount === 0)
    .map(s => s.skill);

  const criticalSkills = skillCoverage
    .filter(s => s.gap > 0 && s.engineerCount > 0)
    .map(s => s.skill);

  return {
    missingSkills,
    criticalSkills,
    skillCoverage
  };
}

/**
 * Get detailed skill distribution in the team
 */
export async function getTeamSkillDistribution(): Promise<TeamSkillDistribution[]> {
  const engineers = await User.find({ role: 'engineer' });
  
  // Create a map to store skill distribution
  const skillMap = new Map<string, Set<string>>();
  const skillDetails = new Map<string, TeamSkillDistribution>();

  // Process each engineer's skills
  engineers.forEach(engineer => {
    engineer.skills?.forEach(skill => {
      if (!skillDetails.has(skill)) {
        skillDetails.set(skill, {
          skill,
          engineerCount: 0,
          engineers: []
        });
      }

      const details = skillDetails.get(skill)!;
      details.engineerCount++;
      details.engineers.push({
        name: engineer.name,
        seniority: engineer.seniority || 'unknown',
        availability: engineer.maxCapacity || 0
      });
    });
  });

  return Array.from(skillDetails.values());
}

/**
 * Get recommended engineers for a project based on skills and availability
 */
export async function getRecommendedEngineers(
  projectId: mongoose.Types.ObjectId,
  requiredSkills?: string[]
): Promise<Array<{
  engineer: any;
  matchingSkills: string[];
  missingSkills: string[];
  availability: number;
  score: number;
}>> {
  // Get project details if projectId is provided
  let skills = requiredSkills || [];
  if (!requiredSkills) {
    const project = await Project.findById(projectId);
    if (project) {
      skills = project.requiredSkills;
    }
  }

  // Get all engineers
  const engineers = await User.find({ role: 'engineer' });

  // Calculate match score for each engineer
  const recommendations = engineers.map(engineer => {
    const engineerSkills = engineer.skills || [];
    const matchingSkills = skills.filter(skill => engineerSkills.includes(skill));
    const missingSkills = skills.filter(skill => !engineerSkills.includes(skill));

    // Calculate score based on matching skills and seniority
    const skillScore = (matchingSkills.length / skills.length) * 0.7;
    const seniorityScore = 
      engineer.seniority === 'senior' ? 0.3 :
      engineer.seniority === 'mid' ? 0.2 :
      0.1;

    return {
      engineer,
      matchingSkills,
      missingSkills,
      availability: engineer.maxCapacity || 0,
      score: skillScore + seniorityScore
    };
  });

  // Sort by score descending
  return recommendations.sort((a, b) => b.score - a.score);
} 