import React from 'react';
import { LogOut, User, ShoppingCart, Clock } from 'lucide-react';
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
    <header className="bg-black/90 backdrop-blur-sm border-b border-royal-600/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-royal-600 rounded-lg flex items-center justify-center royal-glow">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-white">Sith Cantina</span>
            </div>
            <div className="ml-8">
              <h1 className="text-lg font-medium text-gray-200">{title}</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {showCart && (
              <button
                onClick={onCartClick}
                className="relative p-2 text-gray-400 hover:text-white transition-colors duration-200 hover-lift"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-royal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center royal-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
            
            <div className="flex items-center space-x-3 glass rounded-lg px-3 py-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-royal-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-sm font-medium text-white">{user?.full_name}</span>
                  {user?.role === 'student' && user?.registration_number && (
                    <div className="text-xs text-gray-400">({user.registration_number})</div>
                  )}
                </div>
              </div>
              <button
                onClick={signOut}
                className="p-1 text-gray-400 hover:text-royal-400 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;