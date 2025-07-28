'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { Crown, AlertCircle, TrendingUp } from 'lucide-react';
import { RazorpaySubscription } from './RazorpaySubscription';

interface SubscriptionWidgetProps {
  refreshTrigger?: number;
}

export const SubscriptionWidget = ({ refreshTrigger }: SubscriptionWidgetProps) => {
  const { token } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [token, refreshTrigger]);

  const fetchSubscriptionStatus = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('/api/subscription/status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscriptionData(data);
      }
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgradeSuccess = () => {
    setShowUpgrade(false);
    fetchSubscriptionStatus();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!subscriptionData) return null;

  const { subscriptionStatus, passwordCount, isProUser, canAddPasswords } = subscriptionData;
  const usagePercentage = isProUser ? 0 : (passwordCount / 25) * 100;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {isProUser ? (
              <Crown className="h-5 w-5 text-yellow-500" />
            ) : (
              <TrendingUp className="h-5 w-5 text-gray-400" />
            )}
            <h3 className="font-semibold text-gray-900">
              {isProUser ? 'Pro Plan' : 'Free Plan'}
            </h3>
          </div>
          
          {!isProUser && (
            <button
              onClick={() => setShowUpgrade(true)}
              className="text-sm bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-md transition-colors"
            >
              Upgrade
            </button>
          )}
        </div>

        {!isProUser && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Passwords used</span>
              <span>{passwordCount}/25</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  usagePercentage > 80 ? 'bg-red-500' : 
                  usagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
            
            {usagePercentage > 80 && (
              <div className="flex items-center mt-2 text-sm text-amber-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>Almost at your limit! Upgrade for unlimited passwords.</span>
              </div>
            )}
          </div>
        )}

        <div className="text-sm text-gray-600">
          {isProUser ? (
            <div className="space-y-1">
              <p>✓ Unlimited passwords</p>
              <p>✓ Advanced features</p>
              <p>✓ Priority support</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p>• Up to 25 passwords</p>
              <p>• Basic features</p>
              <p>• Email support</p>
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Upgrade to Pro</h2>
              <button
                onClick={() => setShowUpgrade(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <RazorpaySubscription
              onSuccess={handleUpgradeSuccess}
              onError={() => setShowUpgrade(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};