import mongoose from 'mongoose';
import User, { IUser } from '../models/User';
import Assignment, { IAssignment } from '../models/Assignment';
import Project, { IProject } from '../models/Project';

/**
 * Calculate available capacity for an engineer
 * @param engineerId The ID of the engineer
 * @param date Optional date to check capacity for (defaults to current date)
 * @returns Promise with the available capacity
 */
export async function getAvailableCapacity(
  engineerId: mongoose.Types.ObjectId,
  date: Date = new Date()
): Promise<number> {
  try {
    // Get engineer details
    const engineer = await User.findOne({
      _id: engineerId,
      role: 'engineer'
    });

    if (!engineer) {
      throw new Error('Engineer not found');
    }

    // Get active assignments that overlap with the given date
    const activeAssignments = await Assignment.find({
      engineerId,
      startDate: { $lte: date },
      endDate: { $gte: date }
    });

    // Calculate total allocated capacity
    const totalAllocated = activeAssignments.reduce(
      (sum, assignment) => sum + assignment.allocationPercentage,
      0
    );

    return engineer.maxCapacity - totalAllocated;
  } catch (error) {
    console.error('Error calculating available capacity:', error);
    throw error;
  }
}

/**
 * Find suitable engineers for a project based on skills and availability
 * @param projectId The ID of the project
 * @param minAvailability Minimum required availability percentage
 * @returns Promise with array of suitable engineers with their availability
 */
export async function findSuitableEngineers(
  projectId: mongoose.Types.ObjectId,
  minAvailability: number = 0
): Promise<Array<{ engineer: IUser; availableCapacity: number }>> {
  try {
    // Get project details
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Find engineers with matching skills
    const potentialEngineers = await User.find({
      role: 'engineer',
      skills: { $in: project.requiredSkills }
    });

    // Check availability for each engineer
    const suitableEngineers = await Promise.all(
      potentialEngineers.map(async (engineer) => {
        const availableCapacity = await getAvailableCapacity(engineer._id, project.startDate);
        return {
          engineer,
          availableCapacity
        };
      })
    );

    // Filter engineers based on minimum availability requirement
    return suitableEngineers.filter(
      ({ availableCapacity }) => availableCapacity >= minAvailability
    );
  } catch (error) {
    console.error('Error finding suitable engineers:', error);
    throw error;
  }
}

/**
 * Check if an engineer can be assigned to a project
 * @param engineerId The ID of the engineer
 * @param projectId The ID of the project
 * @param allocationPercentage Proposed allocation percentage
 * @returns Promise with boolean indicating if assignment is possible
 */
export async function canAssignEngineer(
  engineerId: mongoose.Types.ObjectId,
  projectId: mongoose.Types.ObjectId,
  allocationPercentage: number
): Promise<boolean> {
  try {
    const [engineer, project] = await Promise.all([
      User.findById(engineerId),
      Project.findById(projectId)
    ]);

    if (!engineer || !project) {
      throw new Error('Engineer or project not found');
    }

    // Check skill match
    const hasRequiredSkills = project.requiredSkills.some(skill =>
      engineer.skills.includes(skill)
    );

    if (!hasRequiredSkills) {
      return false;
    }

    // Check capacity
    const availableCapacity = await getAvailableCapacity(engineerId, project.startDate);
    return availableCapacity >= allocationPercentage;
  } catch (error) {
    console.error('Error checking engineer assignment possibility:', error);
    throw error;
  }
}

/**
 * Get project utilization statistics
 * @param projectId The ID of the project
 * @returns Promise with project utilization details
 */
export async function getProjectUtilization(
  projectId: mongoose.Types.ObjectId
): Promise<{
  totalAllocated: number;
  assignedEngineers: number;
  remainingCapacity: number;
}> {
  try {
    const [project, assignments] = await Promise.all([
      Project.findById(projectId),
      Assignment.find({ projectId })
    ]);

    if (!project) {
      throw new Error('Project not found');
    }

    const uniqueEngineers = new Set(assignments.map(a => a.engineerId.toString()));
    const totalAllocated = assignments.reduce(
      (sum, assignment) => sum + assignment.allocationPercentage,
      0
    );

    return {
      totalAllocated,
      assignedEngineers: uniqueEngineers.size,
      remainingCapacity: (project.teamSize * 100) - totalAllocated
    };
  } catch (error) {
    console.error('Error calculating project utilization:', error);
    throw error;
  }
} 