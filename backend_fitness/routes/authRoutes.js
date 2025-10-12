import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authMiddleware, getCurrentUser);

export default router;
