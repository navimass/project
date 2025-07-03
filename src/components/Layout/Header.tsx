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
    <header className="nav-glass relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 glass rounded-lg flex items-center justify-center glow-soft">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-white font-heading">Sith Cantina</span>
            </div>
            <div className="ml-8">
              <h1 className="text-lg font-medium text-white/90 font-body">{title}</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {showCart && (
              <button
                onClick={onCartClick}
                className="relative p-2 text-white/70 hover:text-white transition-colors duration-200 hover-lift glass rounded-lg"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 glass-pulse text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-heading">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
            
            <div className="flex items-center space-x-3 glass rounded-lg px-3 py-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 glass rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-sm font-medium text-white font-body">{user?.full_name}</span>
                  {user?.role === 'student' && user?.registration_number && (
                    <div className="text-xs text-white/60 font-body">({user.registration_number})</div>
                  )}
                </div>
              </div>
              <button
                onClick={signOut}
                className="p-1 text-white/60 hover:text-white transition-colors duration-200"
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