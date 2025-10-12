import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRunning, FaBed, FaAppleAlt, FaBrain, FaChartLine } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { addHealthLog, getHealthLogs, getLatestLog } from '../utils/healthApi';
import { getAISuggestion } from '../utils/healthApi';
import { getCurrentUser } from '../utils/auth';
import AISuggestionModal from '../components/AISuggestionModal';

const Dashboard = () => {
  const user = getCurrentUser();
  const [formData, setFormData] = useState({
    steps: '',
    sleep_hours: '',
    calories: ''
  });
  const [latestMetrics, setLatestMetrics] = useState(null);
  const [healthLogs, setHealthLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    fetchLatestLog();
    fetchHealthLogs();
  }, []);

  const fetchLatestLog = async () => {
    try {
      const response = await getLatestLog();
      if (response.log) {
        setLatestMetrics(response.log);
      }
    } catch (error) {
      console.error('Error fetching latest log:', error);
    }
  };

  const fetchHealthLogs = async () => {
    try {
      const response = await getHealthLogs(14); // Last 14 days
      setHealthLogs(response.logs || []);
    } catch (error) {
      console.error('Error fetching health logs:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addHealthLog(
        parseInt(formData.steps),
        parseFloat(formData.sleep_hours),
        parseInt(formData.calories)
      );
      toast.success('Health log added successfully!');
      setFormData({ steps: '', sleep_hours: '', calories: '' });
      fetchLatestLog();
      fetchHealthLogs();
    } catch (error) {
      toast.error(error.message || 'Failed to add health log');
    } finally {
      setLoading(false);
    }
  };

  const handleGetAISuggestion = async () => {
    setLoadingAI(true);
    try {
      const response = await getAISuggestion();
      setAiSuggestions(response);
      setShowAIModal(true);
    } catch (error) {
      toast.error(error.message || 'Failed to get AI suggestions');
    } finally {
      setLoadingAI(false);
    }
  };

  const metricCards = [
    {
      icon: <FaRunning className="text-4xl" />,
      title: 'Steps',
      value: latestMetrics?.steps || 0,
      unit: 'steps',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: <FaBed className="text-4xl" />,
      title: 'Sleep',
      value: latestMetrics?.sleep_hours || 0,
      unit: 'hours',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: <FaAppleAlt className="text-4xl" />,
      title: 'Calories',
      value: latestMetrics?.calories || 0,
      unit: 'kcal',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-fitness-light via-white to-blue-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome back, <span className="bg-gradient-to-r from-fitness-primary to-fitness-secondary bg-clip-text text-transparent">{user?.name}!</span>
            </h1>
            <p className="text-gray-600 text-lg">Track your daily metrics and get personalized AI insights</p>
          </motion.div>

          {/* Metric Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {metricCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`${card.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all`}
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${card.color} text-white mb-4`}>
                  {card.icon}
                </div>
                <h3 className="text-gray-600 font-medium mb-2">{card.title}</h3>
                <div className="flex items-end space-x-2">
                  <span className="text-4xl font-bold text-gray-800">
                    {card.value.toLocaleString()}
                  </span>
                  <span className="text-gray-500 mb-1">{card.unit}</span>
                </div>
                {latestMetrics && (
                  <p className="text-xs text-gray-500 mt-2">
                    Last updated: {new Date(latestMetrics.log_date).toLocaleDateString()}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Form */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaChartLine className="mr-2 text-fitness-primary" />
                  Log Today's Metrics
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Steps 👣
                    </label>
                    <input
                      type="number"
                      name="steps"
                      value={formData.steps}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fitness-primary focus:border-transparent transition-all"
                      placeholder="e.g., 8000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sleep Hours 😴
                    </label>
                    <input
                      type="number"
                      name="sleep_hours"
                      value={formData.sleep_hours}
                      onChange={handleChange}
                      required
                      min="0"
                      max="24"
                      step="0.5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fitness-primary focus:border-transparent transition-all"
                      placeholder="e.g., 7.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calories 🍎
                    </label>
                    <input
                      type="number"
                      name="calories"
                      value={formData.calories}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fitness-primary focus:border-transparent transition-all"
                      placeholder="e.g., 2000"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-fitness-primary to-fitness-secondary text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Today\'s Log'}
                  </motion.button>
                </form>

                {/* AI Suggestion Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGetAISuggestion}
                  disabled={loadingAI || !latestMetrics}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-fitness-info to-fitness-secondary text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <FaBrain />
                  <span>{loadingAI ? 'Loading...' : 'Get AI Suggestions'}</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Charts */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Steps Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Steps Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={healthLogs}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="log_date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="steps" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Sleep & Calories Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Sleep & Nutrition Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={healthLogs}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="log_date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="sleep_hours" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      dot={{ fill: '#8B5CF6', r: 4 }}
                      name="Sleep (hrs)"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="calories" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ fill: '#10B981', r: 4 }}
                      name="Calories"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* AI Suggestion Modal */}
      <AISuggestionModal
        show={showAIModal}
        onClose={() => setShowAIModal(false)}
        suggestions={aiSuggestions}
      />
    </div>
  );
};

export default Dashboard;
