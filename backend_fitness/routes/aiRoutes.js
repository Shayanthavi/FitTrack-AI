import express from 'express';
import { getAISuggestion } from '../controllers/aiController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

// ML prediction only
router.get('/suggestion', getAISuggestion);

export default router;
