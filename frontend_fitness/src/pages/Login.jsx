import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaDumbbell, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { login } from '../utils/auth';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
      const result = await login(formData.email, formData.password);
      toast.success('Login successful! Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fitness-primary via-fitness-secondary to-fitness-info flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
          <FaDumbbell className="text-4xl text-white" />
          <span className="text-3xl font-bold text-white">
            FitTrack AI
          </span>
        </Link>

        {/* Login Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Welcome Back</h2>
          <p className="text-gray-600 text-center mb-8">Sign in to continue your fitness journey</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fitness-primary focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                        className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fitness-primary focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-fitness-primary to-fitness-secondary text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-fitness-primary font-semibold hover:text-fitness-secondary transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-white hover:text-gray-200 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
