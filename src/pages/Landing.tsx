import React, { useState } from 'react';
import { Clock, Users, ChefHat, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThreeJsRobot from '../components/Common/ThreeJsRobot';
import SpecialMenu from '../components/Common/SpecialMenu';

const Landing: React.FC = () => {
  const [isSpecialMenuOpen, setIsSpecialMenuOpen] = useState(false);
  const [robotClicks, setRobotClicks] = useState(0);

  const handleRobotClick = () => {
    setRobotClicks(prev => prev + 1);
    
    if (robotClicks === 0) {
      alert('🤖 Beep boop! You found me! Click me 2 more times to unlock something special...');
    } else if (robotClicks === 1) {
      alert('🤖 *excited droid noises* Almost there! One more click!');
    } else if (robotClicks === 2) {
      alert('🤖 BEEP BEEP! Secret menu unlocked! Welcome to the hidden galactic cantina!');
      setIsSpecialMenuOpen(true);
    } else {
      // After unlocking, always show menu
      setIsSpecialMenuOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-galactic-gradient relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-royal-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-royal-300 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-40 w-1 h-1 bg-sith-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Header */}
      <header className="bg-black/80 backdrop-blur-sm border-b border-royal-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-royal-600 rounded-lg flex items-center justify-center royal-glow mr-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-wide">Sith Cantina</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Skip the Queue,<br />
            <span className="bg-gradient-to-r from-royal-400 to-royal-600 bg-clip-text text-transparent">Order Ahead</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Pre-order your favorite meals and skip the lunch rush. Pick up when ready, 
            no waiting in line required.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Student Card */}
          <Link to="/auth/student" className="group">
            <div className="galactic-card rounded-2xl p-8 hover-lift transition-all duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-royal-600 rounded-xl mb-6 group-hover:bg-royal-500 transition-colors duration-300 royal-glow">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">I'm a Student</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Browse menus, place orders, and track your food status. 
                Perfect for busy students who want to save time.
              </p>
              <div className="flex items-center text-royal-400 font-semibold group-hover:text-royal-300 transition-colors">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </Link>

          {/* Staff Card */}
          <Link to="/auth/staff" className="group">
            <div className="galactic-card rounded-2xl p-8 hover-lift transition-all duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-sith-600 rounded-xl mb-6 group-hover:bg-sith-500 transition-colors duration-300 sith-glow">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">I'm Canteen Staff</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Manage orders, update menus, and streamline your canteen operations. 
                Reduce wait times and improve customer satisfaction.
              </p>
              <div className="flex items-center text-sith-400 font-semibold group-hover:text-sith-300 transition-colors">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500 transition-colors float">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Save Time</h3>
            <p className="text-gray-400">No more waiting in long queues during busy lunch hours</p>
          </div>
          <div className="text-center group">
            <div className="w-12 h-12 bg-royal-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-royal-500 transition-colors float royal-glow" style={{ animationDelay: '0.5s' }}>
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Easy Ordering</h3>
            <p className="text-gray-400">Browse menus and place orders from your phone</p>
          </div>
          <div className="text-center group">
            <div className="w-12 h-12 bg-sith-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-sith-500 transition-colors sith-glow float" style={{ animationDelay: '1s' }}>
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Real-time Updates</h3>
            <p className="text-gray-400">Get notified when your order is ready for pickup</p>
          </div>
        </div>

        {/* Easter Egg Hint */}
        {robotClicks === 0 && (
          <div className="mt-16 text-center">
            <p className="text-gray-500 text-sm">
              👀 Psst... there might be a friendly droid hiding somewhere on this page...
            </p>
          </div>
        )}
      </main>

      {/* Three.js Robot (Easter Egg) */}
      <ThreeJsRobot onRobotClick={handleRobotClick} />

      {/* Special Menu Modal */}
      <SpecialMenu 
        isOpen={isSpecialMenuOpen} 
        onClose={() => setIsSpecialMenuOpen(false)} 
      />
    </div>
  );
};

export default Landing;