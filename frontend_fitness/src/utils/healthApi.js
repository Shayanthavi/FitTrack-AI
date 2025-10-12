import api from '../config/api';

// Health log API functions

export const addHealthLog = async (steps, sleep_hours, calories) => {
  try {
    const response = await api.post('/health/add-log', {
      steps,
      sleep_hours,
      calories,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to add health log' };
  }
};

export const getHealthLogs = async (limit = 30) => {
  try {
    const response = await api.get(`/health/get-logs?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch health logs' };
  }
};

export const getLatestLog = async () => {
  try {
    const response = await api.get('/health/latest');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch latest log' };
  }
};

export const getHealthStats = async (days = 7) => {
  try {
    const response = await api.get(`/health/stats?days=${days}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch health stats' };
  }
};

// AI Suggestion API
export const getAISuggestion = async () => {
  try {
    const response = await api.get('/ai/suggestion');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get AI suggestions' };
  }
};

export const getSuggestionHistory = async (limit = 10) => {
  try {
    const response = await api.get(`/ai/history?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch suggestion history' };
  }
};
