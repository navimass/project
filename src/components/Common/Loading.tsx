import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

const Loading: React.FC = () => {
  const isConfigured = isSupabaseConfigured();

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 glass rounded-full flex items-center justify-center mx-auto mb-4 glow-medium">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Database Not Connected</h2>
          <p className="text-white/70 mb-4">
            Please connect to Supabase to use the application. Click the "Connect to Supabase" button in the top right corner.
          </p>
          <div className="glass-card rounded-lg p-4">
            <p className="text-sm text-white/60">
              <strong>Note:</strong> You need to set up your Supabase project and configure the environment variables to proceed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 glass-spinner mx-auto mb-4"></div>
        <div className="flex items-center justify-center space-x-2">
          <Clock className="w-5 h-5 text-white/70" />
          <span className="text-lg font-medium text-white/90">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default Loading;