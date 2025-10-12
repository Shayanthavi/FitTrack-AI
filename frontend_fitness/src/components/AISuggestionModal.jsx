import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaBrain } from 'react-icons/fa';

const AISuggestionModal = ({ show, onClose, suggestions }) => {
  if (!show || !suggestions) return null;

  const getLevelIcon = (level) => {
    switch (level) {
      case 'success':
        return <FaCheckCircle className="text-fitness-success" />;
      case 'warning':
        return <FaExclamationTriangle className="text-fitness-warning" />;
      case 'urgent':
        return <FaExclamationTriangle className="text-fitness-danger" />;
      default:
        return <FaInfoCircle className="text-fitness-info" />;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'success':
        return 'from-green-500 to-emerald-500';
      case 'warning':
        return 'from-yellow-500 to-orange-500';
      case 'urgent':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-blue-500 to-cyan-500';
    }
  };

  const overallSuggestion = suggestions.suggestions?.find(s => s.category === 'Overall');
  const otherSuggestions = suggestions.suggestions?.filter(s => s.category !== 'Overall') || [];

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-fitness-primary to-fitness-secondary p-6 text-white relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                >
                  <FaTimes className="text-2xl" />
                </button>
                <div className="flex items-center space-x-3">
                  <FaBrain className="text-4xl" />
                  <div>
                    <h2 className="text-3xl font-bold">AI Health Insights</h2>
                    <p className="text-white/90 mt-1">Personalized recommendations for you</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Based On */}
                {suggestions.based_on && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">Based on your metrics from {new Date(suggestions.based_on.date).toLocaleDateString()}:</p>
                    <div className="flex flex-wrap gap-4">
                      <span className="text-sm font-semibold text-gray-800">
                        👣 {suggestions.based_on.steps} steps
                      </span>
                      <span className="text-sm font-semibold text-gray-800">
                        😴 {suggestions.based_on.sleep_hours} hrs sleep
                      </span>
                      <span className="text-sm font-semibold text-gray-800">
                        🍎 {suggestions.based_on.calories} kcal
                      </span>
                    </div>
                  </div>
                )}

                {/* Overall Health Score */}
                {overallSuggestion && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-6 p-6 bg-gradient-to-br from-fitness-primary/10 to-fitness-secondary/10 rounded-2xl border-2 border-fitness-primary/20"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-800">Overall Health Score</h3>
                      {overallSuggestion.score && (
                        <div className="text-3xl font-bold text-fitness-primary">
                          {overallSuggestion.score}/100
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700 mb-2">{overallSuggestion.message}</p>
                    <p className="text-sm text-gray-600 italic">💡 {overallSuggestion.tip}</p>
                  </motion.div>
                )}

                {/* Individual Suggestions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Detailed Insights</h3>
                  {otherSuggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white border-2 border-gray-100 rounded-xl p-5 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 p-3 rounded-lg bg-gradient-to-br ${getLevelColor(suggestion.level)} text-white`}>
                          {getLevelIcon(suggestion.level)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-gray-800">{suggestion.category}</h4>
                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                              suggestion.level === 'success' ? 'bg-green-100 text-green-700' :
                              suggestion.level === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                              suggestion.level === 'urgent' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {suggestion.level.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">{suggestion.message}</p>
                          <p className="text-sm text-gray-600 italic">💡 {suggestion.tip}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full py-3 bg-gradient-to-r from-fitness-primary to-fitness-secondary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Got it, Thanks!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AISuggestionModal;
