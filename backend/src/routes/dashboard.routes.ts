import express from 'express';
import { getManagerDashboard, getEngineerDashboard } from '../controllers/dashboard.controller';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';

const router = express.Router();

// Manager dashboard route
router.get('/manager', auth, checkRole('manager'), getManagerDashboard);

// Engineer dashboard route
router.get('/engineer', auth, checkRole('engineer'), getEngineerDashboard);

export default router; 