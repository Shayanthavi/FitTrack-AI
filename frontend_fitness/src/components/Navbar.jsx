import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaDumbbell, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { isAuthenticated, logout, getCurrentUser } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = isAuthenticated();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    ...(isAuth ? [{ path: '/dashboard', label: 'Dashboard' }] : []),
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaDumbbell className="text-3xl text-fitness-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-fitness-primary to-fitness-secondary bg-clip-text text-transparent">
              FitTrack AI
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-lg font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-fitness-primary'
                    : 'text-gray-600 hover:text-fitness-primary'
                }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-gradient-to-r from-fitness-primary to-fitness-secondary"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuth ? (
              <>
                <div className="hidden md:flex items-center space-x-2 text-gray-700">
                  <FaUser className="text-fitness-primary" />
                  <span className="font-medium">{user?.name}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-fitness-danger to-red-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-fitness-primary font-medium hover:text-fitness-secondary transition-colors"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-fitness-primary to-fitness-secondary text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow"
                  >
                    Get Started
                  </motion.button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
