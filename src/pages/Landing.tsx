import React from 'react';
import { Zap, Users, Utensils, ArrowRight, Sparkles, Shield, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-space-gradient relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header 
        className="bg-black/80 backdrop-blur-sm border-b border-jedi-500/30"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-12 h-12 bg-jedi-gradient rounded-lg flex items-center justify-center lightsaber-glow mr-4"
                animate={{ 
                  boxShadow: [
                    '0 0 20px #00d4ff',
                    '0 0 40px #00d4ff',
                    '0 0 20px #00d4ff'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="w-7 h-7 text-white" />
              </motion.div>
              <span className="text-3xl font-bold text-white glow-text font-orbitron tracking-wider">
                GALACTIC CANTINA
              </span>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-bold text-white mb-8 font-orbitron tracking-wider"
            animate={{ 
              textShadow: [
                '0 0 20px #00d4ff',
                '0 0 40px #00d4ff',
                '0 0 60px #00d4ff',
                '0 0 40px #00d4ff',
                '0 0 20px #00d4ff'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ORDER FROM
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-jedi-400 via-rebel-400 to-jedi-400">
              THE STARS
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 font-orbitron leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Skip the cantina queues across the galaxy. Pre-order your favorite meals from 
            the finest establishments in the Outer Rim. Pick up when ready, no waiting required.
          </motion.p>

          {/* Floating elements */}
          <div className="relative">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-jedi-400 rounded-full"
                style={{
                  left: `${20 + i * 12}%`,
                  top: `${Math.random() * 100}px`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Role Selection Cards */}
        <motion.div 
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {/* Student Card */}
          <Link to="/auth/student" className="group">
            <motion.div 
              className="bg-black/60 backdrop-blur-sm rounded-2xl p-8 border border-jedi-500/30 hover:border-jedi-400/60 transition-all duration-500 relative overflow-hidden hologram"
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 30px rgba(0, 212, 255, 0.3)'
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-jedi-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                layoutId="student-bg"
              />
              
              <motion.div 
                className="flex items-center justify-center w-20 h-20 bg-jedi-gradient rounded-xl mb-6 lightsaber-glow relative z-10"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Users className="w-10 h-10 text-white" />
              </motion.div>
              
              <h3 className="text-3xl font-bold text-white mb-4 glow-text font-orbitron">
                REBEL ALLIANCE
              </h3>
              <p className="text-gray-300 mb-6 font-orbitron leading-relaxed">
                Join the Rebellion! Browse galactic menus, place orders across star systems, 
                and track your food status. Perfect for busy rebels fighting the Empire.
              </p>
              
              <motion.div 
                className="flex items-center text-jedi-400 font-semibold group-hover:text-jedi-300 font-orbitron tracking-wide"
                whileHover={{ x: 10 }}
              >
                <span>ENLIST NOW</span>
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
              </motion.div>
            </motion.div>
          </Link>

          {/* Staff Card */}
          <Link to="/auth/staff" className="group">
            <motion.div 
              className="bg-black/60 backdrop-blur-sm rounded-2xl p-8 border border-rebel-500/30 hover:border-rebel-400/60 transition-all duration-500 relative overflow-hidden hologram"
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 30px rgba(255, 107, 53, 0.3)'
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-rebel-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                layoutId="staff-bg"
              />
              
              <motion.div 
                className="flex items-center justify-center w-20 h-20 bg-rebel-gradient rounded-xl mb-6 lightsaber-glow-red relative z-10"
                animate={{ 
                  boxShadow: [
                    '0 0 20px #ff6b35',
                    '0 0 40px #ff6b35',
                    '0 0 20px #ff6b35'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Utensils className="w-10 h-10 text-white" />
              </motion.div>
              
              <h3 className="text-3xl font-bold text-white mb-4 glow-text-yellow font-orbitron">
                CANTINA OPERATOR
              </h3>
              <p className="text-gray-300 mb-6 font-orbitron leading-relaxed">
                Manage your cantina operations across the galaxy. Update menus, process orders, 
                and streamline your establishment. Reduce wait times and maximize profits.
              </p>
              
              <motion.div 
                className="flex items-center text-rebel-400 font-semibold group-hover:text-rebel-300 font-orbitron tracking-wide"
                whileHover={{ x: 10 }}
              >
                <span>JOIN THE CREW</span>
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
              </motion.div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          {[
            {
              icon: Rocket,
              title: "LIGHTSPEED ORDERING",
              description: "No more waiting in cantina queues during busy hyperspace routes",
              color: "jedi"
            },
            {
              icon: Sparkles,
              title: "FORCE-POWERED INTERFACE",
              description: "Browse menus and place orders using the power of the Force",
              color: "sith"
            },
            {
              icon: Shield,
              title: "REAL-TIME UPDATES",
              description: "Get notified via hologram when your order is ready for pickup",
              color: "rebel"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="text-center group"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className={`w-16 h-16 bg-${feature.color}-gradient rounded-xl flex items-center justify-center mx-auto mb-4 lightsaber-glow group-hover:scale-110 transition-transform duration-300`}
                animate={{ 
                  boxShadow: [
                    `0 0 20px var(--tw-${feature.color}-400)`,
                    `0 0 40px var(--tw-${feature.color}-400)`,
                    `0 0 20px var(--tw-${feature.color}-400)`
                  ]
                }}
                transition={{ duration: 2 + index, repeat: Infinity }}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-lg font-semibold text-white mb-2 glow-text font-orbitron">
                {feature.title}
              </h3>
              <p className="text-gray-400 font-orbitron text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.p 
            className="text-lg text-gray-400 font-orbitron mb-8"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            "This is the way... to order food." - The Mandalorian
          </motion.p>
          
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-sm text-jedi-300 font-orbitron tracking-widest">
              MAY THE FORKS BE WITH YOU
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Landing;