import React from 'react';
import { Zap, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { isSupabaseConfigured } from '../../lib/supabase';

const Loading: React.FC = () => {
  const isConfigured = isSupabaseConfigured();

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-space-gradient relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-jedi-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <motion.div 
          className="text-center max-w-md mx-auto p-6 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="w-20 h-20 bg-imperial-gradient rounded-full flex items-center justify-center mx-auto mb-6 holo-border"
            animate={{ 
              boxShadow: [
                '0 0 20px #ff0000',
                '0 0 40px #ff0000',
                '0 0 20px #ff0000'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <AlertTriangle className="w-10 h-10 text-imperial-400" />
          </motion.div>
          
          <motion.h2 
            className="text-2xl font-bold text-white mb-4 glow-text-red font-orbitron"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            GALACTIC DATABASE OFFLINE
          </motion.h2>
          
          <p className="text-gray-300 mb-6 font-orbitron">
            The Death Star's mainframe is not connected. Establish a connection to the Galactic Network to access the cantina systems.
          </p>
          
          <motion.div 
            className="bg-imperial-900/30 border border-imperial-500/50 rounded-lg p-4 hologram"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-imperial-300 font-orbitron">
              <strong>IMPERIAL NOTICE:</strong> Connect to Supabase to restore full cantina operations and access the galactic menu database.
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-space-gradient relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-jedi-400 rounded-full"
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

      <motion.div 
        className="text-center relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Rotating lightsaber */}
        <motion.div
          className="relative w-24 h-24 mx-auto mb-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 bg-jedi-gradient rounded-full lightsaber-glow"></div>
          <motion.div 
            className="absolute inset-2 bg-jedi-400 rounded-full"
            animate={{ 
              boxShadow: [
                '0 0 20px #00d4ff',
                '0 0 40px #00d4ff',
                '0 0 60px #00d4ff',
                '0 0 40px #00d4ff',
                '0 0 20px #00d4ff'
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <Zap className="absolute inset-0 w-8 h-8 text-white m-auto" />
        </motion.div>

        <motion.div 
          className="flex items-center justify-center space-x-3"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Zap className="w-6 h-6 text-jedi-400" />
          <span className="text-xl font-bold text-white glow-text font-orbitron tracking-wider">
            ACCESSING GALACTIC NETWORK...
          </span>
          <Zap className="w-6 h-6 text-jedi-400" />
        </motion.div>

        <motion.div 
          className="mt-4 text-sm text-gray-400 font-orbitron"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        >
          Establishing connection to the Force...
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Loading;