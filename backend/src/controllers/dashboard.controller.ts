import { Request, Response } from 'express';
import { IUser } from '../models/User';
import User from '../models/User';
import Project, { IProject } from '../models/Project';
import Assignment, { IAssignment } from '../models/Assignment';

interface AuthRequest extends Request {
  user?: IUser;
}

// Get manager dashboard data
export const getManagerDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const managerId = req.user?._id;

    // Get all engineers
    const engineers = await User.find({ role: 'engineer' }).select('-password');

    // Get all projects managed by this manager
    const projects = await Project.find({ managerId });

    // Get all assignments for these projects
    const assignments = await Assignment.find({
      projectId: { $in: projects.map(p => p._id) }
    });

    // Calculate department utilization
    const totalCapacity = engineers.reduce((sum, eng) => sum + (eng.maxCapacity || 0), 0);
    const totalAllocation = engineers.reduce((sum, eng) => sum + (eng.currentAllocation || 0), 0);
    const departmentUtilization = totalCapacity ? Math.round((totalAllocation / totalCapacity) * 100) : 0;

    // Calculate skill distribution
    const skillMap = new Map<string, number>();
    engineers.forEach(engineer => {
      engineer.skills?.forEach(skill => {
        skillMap.set(skill, (skillMap.get(skill) || 0) + 1);
      });
    });

    const skillDistribution = Array.from(skillMap.entries()).map(([skill, count]) => ({
      skill,
      count
    }));

    // Prepare project status data
    const projectsWithStatus = projects.map((project: IProject) => {
      const projectAssignments = assignments.filter(a => 
        a.projectId.toString() === project._id.toString()
      );
      return {
        _id: project._id,
        name: project.name,
        status: project.status,
        teamSize: project.teamSize,
        currentTeamSize: projectAssignments.length
      };
    });

    res.json({
      departmentUtilization,
      engineers: engineers.map(eng => ({
        _id: eng._id,
        name: eng.name,
        currentAllocation: eng.currentAllocation,
        maxCapacity: eng.maxCapacity || 100
      })),
      projects: projectsWithStatus,
      skillDistribution
    });
  } catch (error) {
    console.error('Error getting manager dashboard:', error);
    res.status(500).json({ message: 'Error getting dashboard data' });
  }
};

// Get engineer dashboard data
export const getEngineerDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const engineerId = req.user?._id;

    // Get engineer data
    const engineer = await User.findById(engineerId).select('-password');
    if (!engineer) {
      return res.status(404).json({ message: 'Engineer not found' });
    }

    // Get engineer's assignments
    const assignments = await Assignment.find({ engineerId });

    // Get projects for these assignments
    const projectIds = assignments.map(a => a.projectId);
    const projects = await Project.find({ _id: { $in: projectIds } });

    // Combine project and assignment data
    const activeProjects = assignments.map(assignment => {
      const project = projects.find(p => 
        p._id.toString() === assignment.projectId.toString()
      );
      return {
        _id: project?._id,
        name: project?.name,
        description: project?.description,
        startDate: assignment.startDate,
        endDate: assignment.endDate,
        role: assignment.role,
        allocationPercentage: assignment.allocationPercentage
      };
    });

    res.json({
      _id: engineer._id,
      name: engineer.name,
      currentAllocation: engineer.currentAllocation,
      maxCapacity: engineer.maxCapacity,
      skills: engineer.skills,
      projects: activeProjects
    });
  } catch (error) {
    console.error('Error getting engineer dashboard:', error);
    res.status(500).json({ message: 'Error getting dashboard data' });
  }
}; 