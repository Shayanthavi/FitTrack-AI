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
  // Derived stats
  const [weeklyScores, setWeeklyScores] = useState([]);
  const [streak, setStreak] = useState(0);
  const [personalBest, setPersonalBest] = useState(0);

  // Fetch data on mount
  useEffect(() => {
    fetchLatestLog();
    fetchHealthLogs();
    fetchAISuggestion();
  }, []);

  // Fetch AI suggestion
  const fetchAISuggestion = async () => {
    setLoadingAI(true);
    try {
      const response = await getAISuggestion();
      setAiSuggestions(response);
    } catch (error) {
      // Optionally show error
    } finally {
      setLoadingAI(false);
    }
  };

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
      const response = await getHealthLogs(30); // Last 30 days for better stats
      const logs = response.logs || [];
      setHealthLogs(logs);
      // Calculate improvements (last 7 days health score)
      setWeeklyScores(
        logs.slice(-7).map(log => {
          // Simple health score formula (match backend if possible)
          let score = 0;
          // Steps scoring (0-40)
          if (log.steps >= 10000) score += 40;
          else if (log.steps >= 7000) score += 30;
          else if (log.steps >= 5000) score += 20;
          else score += 10;
          // Sleep scoring (0-30)
          if (log.sleep_hours >= 7 && log.sleep_hours <= 9) score += 30;
          else if (log.sleep_hours >= 6 && log.sleep_hours <= 10) score += 20;
          else score += 10;
          // Calories scoring (0-30)
          if (log.calories >= 1800 && log.calories <= 2200) score += 30;
          else if (log.calories >= 1500 && log.calories <= 2500) score += 20;
          else score += 10;
          return score;
        })
      );
      // Calculate streak (consecutive days with logs)
      let streakCount = 0;
      let prevDate = null;
      for (let i = logs.length - 1; i >= 0; i--) {
        const logDate = new Date(logs[i].log_date);
        if (!prevDate) {
          streakCount = 1;
        } else {
          const diff = (prevDate - logDate) / (1000 * 60 * 60 * 24);
          if (diff === 1) {
            streakCount++;
          } else if (diff > 1) {
            break;
          }
        }
        prevDate = logDate;
      }
      setStreak(streakCount);
      // Calculate personal best (max steps)
      setPersonalBest(logs.reduce((max, log) => Math.max(max, log.steps), 0));
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
      fetchAISuggestion(); // Refresh AI suggestion after new log
    } catch (error) {
      toast.error(error.message || 'Failed to add health log');
    } finally {
      setLoading(false);
    }
  };

  const handleGetAISuggestion = async () => {
    await fetchAISuggestion();
    setShowAIModal(true);
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
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Welcome Section */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-4"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome back, <span className="bg-gradient-to-r from-fitness-primary to-fitness-secondary bg-clip-text text-transparent">{user?.name}!</span>
            </h1>
            {/* Latest Log and Get AI Suggestion button moved here */}
            <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0 items-center justify-between mt-2">
              <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold text-gray-700">Latest Log:</span>
                {latestMetrics ? (
                  <span className="text-gray-600 text-base">
                    {new Date(latestMetrics.log_date).toLocaleDateString()} &bull; Steps: <b>{latestMetrics.steps}</b> &bull; Sleep: <b>{latestMetrics.sleep_hours}h</b> &bull; Calories: <b>{latestMetrics.calories}</b>
                  </span>
                ) : (
                  <span className="text-gray-400">No data yet</span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGetAISuggestion}
                disabled={loadingAI || !latestMetrics}
                className="py-2 px-4 bg-gradient-to-r from-fitness-info to-fitness-secondary text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center space-x-2"
              >
                <FaBrain />
                <span>{loadingAI ? 'Loading...' : 'Get AI Suggestions'}</span>
              </motion.button>
            </div>
          </motion.div>


          {/* Log Today's Metrics, Summary Cards, and Insights side by side (vertical on mobile) */}
          <div className="relative flex flex-col lg:flex-row gap-4 mb-8 items-stretch justify-center">
            {/* Decorative gradient ring accent (hidden on mobile) */}
            <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none" style={{width:'520px',height:'520px'}}>
              <div className="w-full h-full rounded-full bg-gradient-to-br from-fitness-primary/20 via-fitness-secondary/10 to-blue-200/10 blur-2xl opacity-70"></div>
            </div>
            {/* Main Card */}
            <div className="flex flex-col gap-6 w-full max-w-xl mx-auto lg:mx-0 flex-1">
              {/* Log Today's Metrics Card - fit to content */}
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 120 }}
                className="relative z-10 shadow-2xl rounded-3xl bg-white/90 backdrop-blur-lg border border-gray-100 p-8 flex flex-col justify-center"
                style={{ height: 'auto', minHeight: '0' }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center justify-center">
                  <FaChartLine className="mr-2 text-fitness-primary" />
                  Log Today's Metrics
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Steps <span role="img" aria-label="steps">👣</span>
                    </label>
                    <input
                      type="number"
                      name="steps"
                      value={formData.steps}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fitness-primary focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                      placeholder="e.g., 8000"
                    />
                    <span className="text-xs text-gray-400">How many steps did you walk today?</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sleep Hours <span role="img" aria-label="sleep">😴</span>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fitness-primary focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                      placeholder="e.g., 7.5"
                    />
                    <span className="text-xs text-gray-400">Total hours of sleep last night</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calories <span role="img" aria-label="calories">🍎</span>
                    </label>
                    <input
                      type="number"
                      name="calories"
                      value={formData.calories}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fitness-primary focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                      placeholder="e.g., 2000"
                    />
                    <span className="text-xs text-gray-400">Calories consumed today</span>
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
              </motion.div>
              {/* Average Stats Card (new) */}
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 120 }}
                className="relative z-10 shadow-xl rounded-3xl bg-gradient-to-br from-fitness-primary/10 to-fitness-secondary/10 border border-fitness-primary/20 p-6 flex flex-col items-center justify-center"
                style={{ minHeight: '180px', height: 'auto' }}
              >
                <h3 className="text-lg font-bold text-fitness-primary mb-4">This Week's Averages</h3>
                <div className="flex flex-row gap-8 justify-center items-center w-full">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-blue-600">{(healthLogs.slice(-7).reduce((sum, l) => sum + (l.sleep_hours || 0), 0) / (healthLogs.slice(-7).length || 1)).toFixed(1)}</span>
                    <span className="text-xs text-gray-600">Sleep (hrs)</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-green-600">{(healthLogs.slice(-7).reduce((sum, l) => sum + (l.calories || 0), 0) / (healthLogs.slice(-7).length || 1)).toFixed(0)}</span>
                    <span className="text-xs text-gray-600">Calories</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-fitness-secondary">{(healthLogs.slice(-7).reduce((sum, l) => sum + (l.steps || 0), 0) / (healthLogs.slice(-7).length || 1)).toFixed(0)}</span>
                    <span className="text-xs text-gray-600">Steps</span>
                  </div>
                </div>
              </motion.div>
            </div>
            {/* Summary Cards vertically next to the form, enlarged width */}
            <div className="relative z-10 flex flex-row lg:flex-col gap-6 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto lg:mx-0 lg:w-[340px] xl:w-[420px] justify-center items-stretch flex-1">
              {metricCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`${card.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 flex-1 min-w-0 w-full`}
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
            {/* Insights/Stats Panel */}
            <div className="relative z-10 flex flex-col gap-6 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto lg:mx-0 lg:w-[340px] xl:w-[420px] justify-center items-stretch flex-1">
              {/* Last AI Score (dynamic) */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col items-center">
                {(() => {
                  // Try to extract score from aiSuggestions.suggestions (category: 'Overall')
                  let score = null;
                  if (aiSuggestions?.suggestions) {
                    const overall = aiSuggestions.suggestions.find(s => s.category === 'Overall');
                    if (overall && typeof overall.score === 'number') score = overall.score;
                  }
                  return (
                    <>
                      <span className="text-3xl font-bold text-fitness-primary mb-2">{score !== null ? score : <span className="text-gray-400">--</span>}</span>
                      <span className="text-gray-700 font-semibold">Last AI Health Score</span>
                      <span className="text-xs text-gray-400 mt-1">(out of 100)</span>
                    </>
                  );
                })()}
              </div>
              {/* AI Suggestions Preview */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col">
                <span className="text-fitness-secondary font-bold mb-2">AI Suggestion</span>
                <span className="text-gray-700 mb-2 line-clamp-2">{aiSuggestions?.suggestion ?? 'Try to increase your daily step count by 10% for the next week for improved cardiovascular health.'}</span>
                <button onClick={handleGetAISuggestion} className="self-end text-xs text-fitness-primary hover:underline">View More</button>
              </div>
              {/* Improvements Graph (dynamic) */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col">
                <span className="text-fitness-secondary font-bold mb-2">Weekly Improvements</span>
                <div className="w-full h-24 flex items-end gap-1">
                  {weeklyScores.length > 0 ? weeklyScores.map((val, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-fitness-primary to-fitness-secondary rounded-t" style={{height: `${val/1.2}%`}} title={`Score: ${val}`}></div>
                  )) : <span className="text-xs text-gray-400">No data</span>}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>
              {/* Streak/Personal Bests (dynamic) */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col items-center">
                <span className="text-fitness-primary font-bold mb-2">Streak</span>
                <span className="text-3xl font-bold text-fitness-secondary mb-1">{streak}</span>
                <span className="text-gray-700 mb-2">days logged in a row</span>
                <span className="text-xs text-gray-400">Personal Best: {personalBest.toLocaleString()} steps</span>
              </div>
            </div>
          </div>


          {/* Metric Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {metricCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`${card.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100`}
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

          {/* Divider */}
          <div className="border-t border-gray-200 mb-2" />

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Steps Chart */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
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
            </motion.div>

            {/* Sleep & Calories Chart */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
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
