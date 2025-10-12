import pool from '../config/db.js';
import axios from 'axios';

// Predict health score and get suggestions from ML service
export const getAISuggestion = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get latest health log
    const [logs] = await pool.query(
      `SELECT steps, sleep_hours, calories
       FROM health_logs
       WHERE user_id = ?
       ORDER BY log_date DESC
       LIMIT 1`,
      [userId]
    );

    if (!logs.length) {
      return res.status(404).json({
        success: false,
        message: 'No health log found'
      });
    }

    const { steps, sleep_hours, calories } = logs[0];

    // Call ML service for prediction and suggestions
    const mlServiceUrl = 'http://localhost:5000/predict';
    const response = await axios.post(mlServiceUrl, {
      steps,
      sleep_hours,
      calories
    });

    if (response.data.success) {
      res.json({
        success: true,
        suggestions: response.data.suggestions,
        model_used: response.data.model_used,
        based_on: response.data.based_on
      });
    } else {
      res.status(500).json({
        success: false,
        error: response.data.error || 'ML service error'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
};