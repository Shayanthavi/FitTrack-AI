import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { FaRunning, FaBed, FaAppleAlt, FaChartLine, FaBrain, FaShieldAlt } from 'react-icons/fa';
import Navbar from '../components/Navbar';

// Inline Lottie animation data for fitness (lightweight)
const fitnessAnimation = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 500,
  h: 500,
  nm: "Fitness",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Circle",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 1, k: [{ t: 0, s: [0], e: [360] }, { t: 60 }] },
        p: { a: 0, k: [250, 250] },
        a: { a: 0, k: [0, 0] },
        s: { a: 0, k: [100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "el",
              s: { a: 0, k: [200, 200] },
              p: { a: 0, k: [0, 0] }
            },
            {
              ty: "st",
              c: { a: 0, k: [0.388, 0.4, 0.945, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 8 }
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 }
            }
          ]
        }
      ],
      ip: 0,
      op: 60,
      st: 0
    }
  ]
};

const LandingPage = () => {
  const features = [
    {
      icon: <FaRunning className="text-4xl" />,
      title: 'Track Activity',
      description: 'Log your daily steps, exercise, and stay active',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <FaBed className="text-4xl" />,
      title: 'Monitor Sleep',
      description: 'Track sleep hours and improve rest quality',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <FaAppleAlt className="text-4xl" />,
      title: 'Nutrition Tracking',
      description: 'Monitor calories and maintain balanced diet',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <FaChartLine className="text-4xl" />,
      title: 'Visual Analytics',
      description: 'Beautiful charts showing your progress over time',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <FaBrain className="text-4xl" />,
      title: 'AI Suggestions',
      description: 'Get personalized health tips powered by AI',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: 'Secure & Private',
      description: 'Your health data is encrypted and protected',
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fitness-light via-white to-blue-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-fitness-primary via-fitness-secondary to-fitness-info bg-clip-text text-transparent">
                  Transform Your Health
                </span>
                <br />
                <span className="text-gray-800">with AI-Powered Insights</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Track your fitness journey, monitor daily metrics, and receive personalized 
                AI suggestions to achieve your health goals. Start your transformation today!
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-fitness-primary to-fitness-secondary text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
                  >
                    Get Started Free
                  </motion.button>
                </Link>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white text-fitness-primary border-2 border-fitness-primary rounded-xl font-semibold text-lg shadow-md hover:shadow-xl transition-all"
                  >
                    Sign In
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Right Animation */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center"
            >
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-fitness-primary/20 to-fitness-secondary/20 rounded-full blur-3xl"></div>
                <Lottie
                  animationData={fitnessAnimation}
                  loop={true}
                  className="relative z-10"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-fitness-primary to-fitness-secondary bg-clip-text text-transparent">
                Everything You Need
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features to help you achieve your fitness goals
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity" 
                     style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}></div>
                <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-gradient-to-br from-fitness-primary via-fitness-secondary to-fitness-info p-12 rounded-3xl shadow-2xl text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users improving their health with FitTrack AI
            </p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-white text-fitness-primary rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Get Started Now
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 FitTrack AI. Built with ❤️ for your health journey.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
