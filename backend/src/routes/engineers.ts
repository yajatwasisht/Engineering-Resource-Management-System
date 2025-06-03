import express from 'express';
import { auth, requireRole } from '../middleware/auth';
import User from '../models/User';
import { getAvailableCapacity } from '../utils/resourceUtils';

const router = express.Router();

// GET /api/engineers
router.get('/', auth, requireRole(['manager']), async (req, res) => {
  try {
    const engineers = await User.find({ role: 'engineer' })
      .select('-password')
      .sort({ name: 1 });

    res.json(engineers);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/engineers/:id/capacity
router.get('/:id/capacity', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const date = req.query.date ? new Date(req.query.date as string) : new Date();

    // Check if user exists and is an engineer
    const engineer = await User.findOne({ _id: id, role: 'engineer' });
    if (!engineer) {
      return res.status(404).json({ error: 'Engineer not found' });
    }

    // Get available capacity
    const availableCapacity = await getAvailableCapacity(engineer._id, date);

    res.json({
      engineerId: engineer._id,
      name: engineer.name,
      maxCapacity: engineer.maxCapacity,
      availableCapacity,
      date: date.toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 