'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Pricing } from '@/components/landing/Pricing';
import { FAQ } from '@/components/landing/FAQ';
import { Footer } from '@/components/landing/Footer';
import Dashboard from './dashboard/page';

export default function Home() {
  const { user, isLoading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  if (showAuth) {
    return (
      <div>
        {isLogin ? <LoginForm /> : <RegisterForm />}
        
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary-600 hover:text-primary-800 text-sm mr-4"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
          <button
            onClick={() => setShowAuth(false)}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            ← Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Hero onGetStarted={() => setShowAuth(true)} />
      <Features />
      <Pricing 
        onUpgrade={() => setShowUpgrade(true)}
        onGetStarted={() => setShowAuth(true)}
      />
      <FAQ />
      <Footer />
      
      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Sign up to upgrade</h2>
              <button
                onClick={() => setShowUpgrade(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Create an account first, then upgrade to Pro for unlimited passwords.
            </p>
            <button
              onClick={() => {
                setShowUpgrade(false);
                setShowAuth(true);
                setIsLogin(false);
              }}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Create Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}