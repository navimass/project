import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

const Loading: React.FC = () => {
  const isConfigured = isSupabaseConfigured();

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-galactic-gradient">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-royal-600 rounded-full flex items-center justify-center mx-auto mb-4 royal-glow">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Database Not Connected</h2>
          <p className="text-gray-300 mb-4">
            Please connect to Supabase to use the application. Click the "Connect to Supabase" button in the top right corner.
          </p>
          <div className="galactic-card rounded-lg p-4">
            <p className="text-sm text-gray-300">
              <strong>Note:</strong> You need to set up your Supabase project and configure the environment variables to proceed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-galactic-gradient">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-royal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="flex items-center justify-center space-x-2">
          <Clock className="w-5 h-5 text-royal-500" />
          <span className="text-lg font-medium text-gray-200">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default Loading;