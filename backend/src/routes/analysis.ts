import express, { RequestHandler } from 'express';
import mongoose from 'mongoose';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { analyzeSkillGaps, getTeamSkillDistribution, getRecommendedEngineers } from '../utils/skillAnalysis';

const router = express.Router();

// Get skill gap analysis
const getSkillGapAnalysis: RequestHandler = async (req, res) => {
  try {
    const analysis = await analyzeSkillGaps();
    res.json(analysis);
  } catch (error) {
    console.error('Error in skill gap analysis:', error);
    res.status(500).json({ message: 'Error performing skill gap analysis' });
  }
};

// Get team skill distribution
const getTeamSkills: RequestHandler = async (req, res) => {
  try {
    const distribution = await getTeamSkillDistribution();
    res.json(distribution);
  } catch (error) {
    console.error('Error in team skill distribution:', error);
    res.status(500).json({ message: 'Error getting team skill distribution' });
  }
};

// Get recommended engineers for a project
const getRecommendedEngineersForProject: RequestHandler = async (req, res) => {
  try {
    const { projectId } = req.params;
    const recommendations = await getRecommendedEngineers(new mongoose.Types.ObjectId(projectId));
    res.json(recommendations);
  } catch (error) {
    console.error('Error getting engineer recommendations:', error);
    res.status(500).json({ message: 'Error getting engineer recommendations' });
  }
};

router.get('/skill-gaps', authenticateToken, getSkillGapAnalysis);
router.get('/team-skills', authenticateToken, getTeamSkills);
router.get('/recommended-engineers/:projectId', authenticateToken, getRecommendedEngineersForProject);

export default router; 