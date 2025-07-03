import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Utensils, ArrowLeft, Mail, Lock, User, Phone, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const StaffAuth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    mobileNumber: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
        navigate('/staff/dashboard');
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await signUp(
          formData.email,
          formData.password,
          formData.fullName,
          'staff',
          formData.mobileNumber
        );
        navigate('/staff/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rebel-gradient relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-rebel-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <motion.div 
          className="max-w-md w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/" className="inline-flex items-center text-rebel-300 hover:text-rebel-200 mb-6 font-orbitron">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Base
            </Link>
            
            <motion.div 
              className="flex items-center justify-center mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-16 h-16 bg-rebel-gradient rounded-xl flex items-center justify-center lightsaber-glow-red mr-4"
                animate={{ 
                  boxShadow: [
                    '0 0 20px #ff6b35',
                    '0 0 40px #ff6b35',
                    '0 0 20px #ff6b35'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Utensils className="w-8 h-8 text-white" />
              </motion.div>
              <span className="text-3xl font-bold text-white glow-text-yellow font-orbitron">
                CANTINA OPERATOR
              </span>
            </motion.div>
            
            <motion.p 
              className="text-rebel-200 font-orbitron"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {isLogin ? 'Welcome back, Operator!' : 'Join the Cantina Crew'}
            </motion.p>
          </motion.div>

          {/* Form */}
          <motion.div 
            className="bg-black/70 backdrop-blur-sm rounded-2xl p-8 border border-rebel-500/30 holo-border hologram"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div 
                  className="bg-imperial-900/50 border border-imperial-500 rounded-lg p-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <p className="text-sm text-imperial-300 font-orbitron">{error}</p>
                </motion.div>
              )}

              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-rebel-200 mb-2 font-orbitron">
                    Cantina Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-rebel-400" />
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-rebel-500/30 rounded-lg focus:ring-2 focus:ring-rebel-400 focus:border-transparent text-white placeholder-gray-400 font-orbitron"
                      placeholder="Enter your cantina name"
                    />
                  </div>
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-rebel-200 mb-2 font-orbitron">
                  Hologram Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-rebel-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-rebel-500/30 rounded-lg focus:ring-2 focus:ring-rebel-400 focus:border-transparent text-white placeholder-gray-400 font-orbitron"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <label className="block text-sm font-medium text-rebel-200 mb-2 font-orbitron">
                    Comm Frequency
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-rebel-400" />
                    <input
                      type="tel"
                      required
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, mobileNumber: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-rebel-500/30 rounded-lg focus:ring-2 focus:ring-rebel-400 focus:border-transparent text-white placeholder-gray-400 font-orbitron"
                      placeholder="Enter your mobile number"
                    />
                  </div>
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-rebel-200 mb-2 font-orbitron">
                  Access Code
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-rebel-400" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-rebel-500/30 rounded-lg focus:ring-2 focus:ring-rebel-400 focus:border-transparent text-white placeholder-gray-400 font-orbitron"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-rebel-200 mb-2 font-orbitron">
                    Confirm Access Code
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-rebel-400" />
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-rebel-500/30 rounded-lg focus:ring-2 focus:ring-rebel-400 focus:border-transparent text-white placeholder-gray-400 font-orbitron"
                      placeholder="Confirm your password"
                    />
                  </div>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-rebel-gradient text-white py-3 px-4 rounded-lg hover:scale-105 transition-all duration-300 font-medium disabled:opacity-50 lightsaber-glow-red font-orbitron tracking-wide"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    <Zap className="w-5 h-5" />
                  </motion.div>
                ) : (
                  isLogin ? 'ACCESS CANTINA SYSTEMS' : 'JOIN THE CREW'
                )}
              </motion.button>
            </form>

            <motion.div 
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-rebel-400 hover:text-rebel-300 font-medium font-orbitron transition-colors"
              >
                {isLogin ? "New operator? Register cantina" : "Already registered? Sign in"}
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default StaffAuth;