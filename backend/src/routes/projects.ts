import express from 'express';
import { auth, requireRole } from '../middleware/auth';
import Project from '../models/Project';
import { getProjectUtilization } from '../utils/resourceUtils';

const router = express.Router();

// GET /api/projects
router.get('/', auth, async (req, res) => {
  try {
    const query: any = {};
    
    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by manager if user is a manager
    if (req.user?.role === 'manager') {
      query.managerId = req.user._id;
    }

    const projects = await Project.find(query)
      .populate('managerId', 'name email')
      .sort({ startDate: 1 });

    // Get utilization for each project
    const projectsWithUtilization = await Promise.all(
      projects.map(async (project) => {
        const utilization = await getProjectUtilization(project._id);
        return {
          ...project.toObject(),
          utilization
        };
      })
    );

    res.json(projectsWithUtilization);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/projects
router.post('/', auth, requireRole(['manager']), async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      managerId: req.user?._id
    };

    const project = new Project(projectData);
    await project.save();

    res.status(201).json(project);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// GET /api/projects/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('managerId', 'name email');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get project utilization
    const utilization = await getProjectUtilization(project._id);

    res.json({
      ...project.toObject(),
      utilization
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 