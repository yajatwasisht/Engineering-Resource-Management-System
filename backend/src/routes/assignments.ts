import express from 'express';
import { auth, AuthRequest, requireRole } from '../middleware/auth';
import Assignment from '../models/Assignment';
import { canAssignEngineer } from '../utils/resourceUtils';

const router = express.Router();

// GET /api/assignments
router.get('/', auth, async (req: AuthRequest, res) => {
  try {
    const query: any = {};

    // Filter by engineer or project
    if (req.query.engineerId) query.engineerId = req.query.engineerId;
    if (req.query.projectId) query.projectId = req.query.projectId;

    // If engineer, only show their assignments
    if (req.user?.role === 'engineer') {
      query.engineerId = req.user._id;
    }

    const assignments = await Assignment.find(query)
      .populate('engineerId', 'name email')
      .populate('projectId', 'name description')
      .sort({ startDate: 1 });

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/assignments
router.post('/', auth, requireRole(['manager']), async (req, res) => {
  try {
    const { engineerId, projectId, allocationPercentage } = req.body;

    // Check if assignment is possible
    const canAssign = await canAssignEngineer(engineerId, projectId, allocationPercentage);
    if (!canAssign) {
      return res.status(400).json({
        error: 'Cannot assign engineer to project. Check skills match and capacity.'
      });
    }

    const assignment = new Assignment(req.body);
    await assignment.save();

    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate('engineerId', 'name email')
      .populate('projectId', 'name description');

    res.status(201).json(populatedAssignment);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// PUT /api/assignments/:id
router.put('/:id', auth, requireRole(['manager']), async (req, res) => {
  try {
    const { engineerId, projectId, allocationPercentage } = req.body;

    // If changing engineer or allocation, check if it's possible
    if (engineerId || allocationPercentage) {
      const assignment = await Assignment.findById(req.params.id);
      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }

      const canAssign = await canAssignEngineer(
        engineerId || assignment.engineerId,
        projectId || assignment.projectId,
        allocationPercentage || assignment.allocationPercentage
      );

      if (!canAssign) {
        return res.status(400).json({
          error: 'Cannot update assignment. Check skills match and capacity.'
        });
      }
    }

    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('engineerId', 'name email')
      .populate('projectId', 'name description');

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.json(assignment);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// DELETE /api/assignments/:id
router.delete('/:id', auth, requireRole(['manager']), async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 