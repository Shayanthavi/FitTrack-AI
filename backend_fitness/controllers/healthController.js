import pool from '../config/db.js';

// Add daily health log
export const addHealthLog = async (req, res) => {
  try {
    const { steps, sleep_hours, calories } = req.body;
    const userId = req.user.userId;

    // Validation
    if (steps === undefined || sleep_hours === undefined || calories === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields: steps, sleep_hours, calories' 
      });
    }

    // Validate numeric values
    if (steps < 0 || sleep_hours < 0 || calories < 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Values cannot be negative' 
      });
    }

    // Check if log already exists for today
    const today = new Date().toISOString().split('T')[0];
    const [existingLogs] = await pool.query(
      'SELECT * FROM health_logs WHERE user_id = ? AND DATE(log_date) = ?',
      [userId, today]
    );

    let result;
    if (existingLogs.length > 0) {
      // Update existing log
      [result] = await pool.query(
        'UPDATE health_logs SET steps = ?, sleep_hours = ?, calories = ? WHERE user_id = ? AND DATE(log_date) = ?',
        [steps, sleep_hours, calories, userId, today]
      );
      
      res.json({
        success: true,
        message: 'Health log updated successfully',
        log: {
          id: existingLogs[0].id,
          steps,
          sleep_hours,
          calories,
          log_date: today
        }
      });
    } else {
      // Insert new log
      [result] = await pool.query(
        'INSERT INTO health_logs (user_id, steps, sleep_hours, calories) VALUES (?, ?, ?, ?)',
        [userId, steps, sleep_hours, calories]
      );

      res.status(201).json({
        success: true,
        message: 'Health log added successfully',
        log: {
          id: result.insertId,
          steps,
          sleep_hours,
          calories,
          log_date: today
        }
      });
    }
  } catch (error) {
    console.error('Add health log error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while adding health log' 
    });
  }
};

// Get user's health logs
export const getHealthLogs = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 30 } = req.query; // Default to last 30 days

    const [logs] = await pool.query(
      `SELECT id, steps, sleep_hours, calories, DATE_FORMAT(log_date, '%Y-%m-%d') as log_date 
       FROM health_logs 
       WHERE user_id = ? 
       ORDER BY log_date DESC 
       LIMIT ?`,
      [userId, parseInt(limit)]
    );

    res.json({
      success: true,
      count: logs.length,
      logs: logs.reverse() // Return oldest first for charts
    });
  } catch (error) {
    console.error('Get health logs error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching health logs' 
    });
  }
};

// Get latest health log
export const getLatestLog = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [logs] = await pool.query(
      `SELECT id, steps, sleep_hours, calories, DATE_FORMAT(log_date, '%Y-%m-%d') as log_date 
       FROM health_logs 
       WHERE user_id = ? 
       ORDER BY log_date DESC 
       LIMIT 1`,
      [userId]
    );

    if (logs.length === 0) {
      return res.json({
        success: true,
        log: null,
        message: 'No logs found'
      });
    }

    res.json({
      success: true,
      log: logs[0]
    });
  } catch (error) {
    console.error('Get latest log error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching latest log' 
    });
  }
};

// Get health statistics
export const getHealthStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { days = 7 } = req.query;

    const [stats] = await pool.query(
      `SELECT 
        AVG(steps) as avg_steps,
        AVG(sleep_hours) as avg_sleep,
        AVG(calories) as avg_calories,
        MAX(steps) as max_steps,
        MIN(steps) as min_steps,
        COUNT(*) as total_logs
       FROM health_logs 
       WHERE user_id = ? AND log_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)`,
      [userId, parseInt(days)]
    );

    res.json({
      success: true,
      stats: stats[0]
    });
  } catch (error) {
    console.error('Get health stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching statistics' 
    });
  }
};
