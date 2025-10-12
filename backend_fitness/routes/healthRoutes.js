import express from 'express';
import { 
  addHealthLog, 
  getHealthLogs, 
  getLatestLog, 
  getHealthStats 
} from '../controllers/healthController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// @route   POST /api/health/add-log
// @desc    Add or update daily health log
// @access  Private
router.post('/add-log', addHealthLog);

// @route   GET /api/health/get-logs
// @desc    Get user's health logs
// @access  Private
router.get('/get-logs', getHealthLogs);

// @route   GET /api/health/latest
// @desc    Get latest health log
// @access  Private
router.get('/latest', getLatestLog);

// @route   GET /api/health/stats
// @desc    Get health statistics
// @access  Private
router.get('/stats', getHealthStats);

export default router;
