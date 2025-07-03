import React from 'react';
import { LogOut, User, ShoppingCart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  title: string;
  showCart?: boolean;
  cartCount?: number;
  onCartClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, showCart = false, cartCount = 0, onCartClick }) => {
  const { user, signOut } = useAuth();

  return (
    <motion.header 
      className="bg-black/90 backdrop-blur-sm border-b border-jedi-500/30 relative overflow-hidden"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, type: "spring" }}
    >
      {/* Animated background lines */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-jedi-400/20 to-transparent"
            style={{ top: `${20 + i * 20}%`, width: '100%' }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ 
              duration: 3 + i, 
              repeat: Infinity, 
              ease: "linear",
              delay: i * 0.5 
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="flex-shrink-0 flex items-center">
              <motion.div 
                className="w-10 h-10 bg-jedi-gradient rounded-lg flex items-center justify-center lightsaber-glow mr-3"
                animate={{ 
                  boxShadow: [
                    '0 0 10px #00d4ff',
                    '0 0 20px #00d4ff',
                    '0 0 10px #00d4ff'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-2xl font-bold text-white glow-text font-orbitron tracking-wider">
                GALACTIC CANTINA
              </span>
            </div>
            <motion.div 
              className="ml-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-lg font-medium text-jedi-300 font-orbitron tracking-wide">
                {title}
              </h1>
            </motion.div>
          </motion.div>

          <div className="flex items-center space-x-6">
            {showCart && (
              <motion.button
                onClick={onCartClick}
                className="relative p-3 text-gray-300 hover:text-jedi-400 transition-colors duration-300 group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-jedi-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  layoutId="cart-hover"
                />
                <ShoppingCart className="w-6 h-6 relative z-10" />
                {cartCount > 0 && (
                  <motion.span 
                    className="absolute -top-1 -right-1 bg-rebel-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold lightsaber-glow-red font-orbitron"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>
            )}
            
            <motion.div 
              className="flex items-center space-x-4 bg-gray-900/50 rounded-lg px-4 py-2 holo-border"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  className="w-8 h-8 bg-jedi-gradient rounded-full flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <User className="w-4 h-4 text-white" />
                </motion.div>
                <div>
                  <span className="text-sm font-medium text-white font-orbitron">
                    {user?.full_name}
                  </span>
                  {user?.role === 'student' && user?.registration_number && (
                    <div className="text-xs text-jedi-300 font-orbitron">
                      ID: {user.registration_number}
                    </div>
                  )}
                  {user?.role === 'staff' && (
                    <div className="text-xs text-rebel-300 font-orbitron">
                      CANTINA OPERATOR
                    </div>
                  )}
                </div>
              </div>
              
              <motion.button
                onClick={signOut}
                className="p-2 text-gray-400 hover:text-imperial-400 transition-colors duration-300 group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="Sign Out"
              >
                <motion.div
                  className="absolute inset-0 bg-imperial-500/20 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  layoutId="logout-hover"
                />
                <LogOut className="w-5 h-5 relative z-10" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;