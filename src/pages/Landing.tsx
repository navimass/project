import React from 'react';
import { Clock, Users, ChefHat, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hyper-realistic floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle w-4 h-4 top-20 left-10 float glow-soft" style={{ animationDelay: '0s' }}></div>
        <div className="particle w-3 h-3 top-40 right-20 float-slow" style={{ animationDelay: '1s' }}></div>
        <div className="particle w-5 h-5 bottom-40 left-20 float" style={{ animationDelay: '2s' }}></div>
        <div className="particle w-2 h-2 bottom-20 right-40 float-slow" style={{ animationDelay: '0.5s' }}></div>
        <div className="particle w-3 h-3 top-1/2 left-1/4 float" style={{ animationDelay: '3s' }}></div>
        <div className="particle w-4 h-4 top-1/3 right-1/3 float-slow" style={{ animationDelay: '1.5s' }}></div>
        <div className="particle w-2 h-2 top-3/4 left-3/4 float" style={{ animationDelay: '2.5s' }}></div>
        <div className="particle w-3 h-3 top-1/4 left-1/2 float-slow" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="nav-glass relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 glass rounded-lg flex items-center justify-center glow-soft mr-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-wide font-heading">Sith Cantina</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight font-heading">
            Skip the Queue,<br />
            <span className="gradient-text">Order Ahead</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed glass-text font-body">
            Pre-order your favorite meals and skip the lunch rush. Pick up when ready, 
            no waiting in line required.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Student Card */}
          <Link to="/auth/student" className="group">
            <div className="glass-card p-8 hover-lift transition-glass">
              <div className="flex items-center justify-center w-16 h-16 glass rounded-xl mb-6 group-hover:glow-medium transition-glass">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-heading">I'm a Student</h3>
              <p className="text-white/70 mb-6 leading-relaxed font-body">
                Browse menus, place orders, and track your food status. 
                Perfect for busy students who want to save time.
              </p>
              <div className="flex items-center text-white font-semibold group-hover:text-white/90 transition-colors font-body">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </Link>

          {/* Staff Card */}
          <Link to="/auth/staff" className="group">
            <div className="glass-card p-8 hover-lift transition-glass">
              <div className="flex items-center justify-center w-16 h-16 glass rounded-xl mb-6 group-hover:glow-medium transition-glass">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-heading">I'm Canteen Staff</h3>
              <p className="text-white/70 mb-6 leading-relaxed font-body">
                Manage orders, update menus, and streamline your canteen operations. 
                Reduce wait times and improve customer satisfaction.
              </p>
              <div className="flex items-center text-white font-semibold group-hover:text-white/90 transition-colors font-body">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="w-12 h-12 glass rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:glow-soft transition-glass float">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 font-heading">Save Time</h3>
            <p className="text-white/60 font-body">No more waiting in long queues during busy lunch hours</p>
          </div>
          <div className="text-center group">
            <div className="w-12 h-12 glass rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:glow-soft transition-glass float" style={{ animationDelay: '0.5s' }}>
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 font-heading">Easy Ordering</h3>
            <p className="text-white/60 font-body">Browse menus and place orders from your phone</p>
          </div>
          <div className="text-center group">
            <div className="w-12 h-12 glass rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:glow-soft transition-glass float" style={{ animationDelay: '1s' }}>
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 font-heading">Real-time Updates</h3>
            <p className="text-white/60 font-body">Get notified when your order is ready for pickup</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;