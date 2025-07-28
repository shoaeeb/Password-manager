'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Crown, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaymentSuccess() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Get subscription ID from URL after component mounts
    const urlParams = new URLSearchParams(window.location.search);
    const subscriptionId = urlParams.get('subscription_id');
    
    if (subscriptionId) {
      updateSubscriptionStatus(subscriptionId);
    } else {
      setIsProcessing(false);
    }
  }, []);

  const updateSubscriptionStatus = async (subscriptionId: string) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/subscription/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subscriptionId,
          status: 'active',
          planId: 'pro-plan',
        }),
      });

      if (response.ok) {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Failed to update subscription:', error);
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-4"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="h-12 w-12 text-green-600" />
          </motion.div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Pro! 🎉
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your subscription has been activated successfully. You now have access to unlimited passwords and premium features.
          </p>

          <div className="bg-primary-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Crown className="h-5 w-5 text-primary-600" />
              <span className="font-semibold text-primary-900">Pro Features Unlocked</span>
            </div>
            <ul className="text-sm text-primary-800 space-y-1">
              <li>✓ Unlimited password storage</li>
              <li>✓ Advanced search and filtering</li>
              <li>✓ Secure password sharing</li>
              <li>✓ Export functionality</li>
              <li>✓ Priority support</li>
            </ul>
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-xs text-gray-500 mt-4">
            You can manage your subscription anytime from your dashboard
          </p>
        </div>
      </motion.div>
    </div>
  );
}