"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import toast from "react-hot-toast";

interface RazorpaySubscriptionProps {
  onSuccess?: () => void;
  onError?: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const RazorpaySubscription = ({
  onSuccess,
  onError,
}: RazorpaySubscriptionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [planId, setPlanId] = useState<string | null>(null);
  const { token, user } = useAuth();

  useEffect(() => {
    createPlan();
  }, []);

  const createPlan = async () => {
    // Use plan ID from environment variables
    const planId = process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID;
    
    if (planId) {
      setPlanId(planId);
    } else {
      console.error('NEXT_PUBLIC_RAZORPAY_PLAN_ID not set in environment variables');
    }
    
    // Uncomment below for dynamic plan creation if your account supports it
    /*
    try {
      const response = await fetch('/api/razorpay/create-plan', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setPlanId(data.plan.id);
      } else {
        console.error('Plan creation failed:', data);
      }
    } catch (error) {
      console.error('Failed to create plan:', error);
    }
    */
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay SDK");
      }

      if (!planId) {
        throw new Error('Plan not ready');
      }

      // Create Razorpay subscription
      const response = await fetch('/api/razorpay/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription');
      }

      // Initialize Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: data.subscription.id,
        name: 'SecurePass',
        description: 'Pro Monthly Subscription',
        handler: async (response: any) => {
          try {
            // Verify subscription payment
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (verifyResponse.ok) {
              toast.success('Payment successful! Pro features activated.');
              onSuccess?.();
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error: any) {
            toast.error(error.message || 'Payment verification failed');
            onError?.();
          }
        },
        prefill: {
          name: user?.email?.split('@')[0] || 'User',
          email: user?.email || '',
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled');
            onError?.();
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error: any) {
      console.error('Upgrade error:', error);
      toast.error(error.message || 'Failed to start payment');
      onError?.();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg border">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Upgrade to Pro
          </h3>
          <div className="text-3xl font-bold text-primary-600 mb-1">
            ₹260<span className="text-lg text-gray-500">/month</span>
          </div>
          <p className="text-gray-600">
            Unlimited passwords and premium features
          </p>
        </div>

        <button
          onClick={handleUpgrade}
          disabled={isLoading || !planId}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          <span>
            {isLoading ? "Processing..." : planId ? "Subscribe with Razorpay" : "Loading..."}
          </span>
        </button>

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>• Cancel anytime</p>
          <p>• 30-day money back guarantee</p>
          <p>• Secure payment with Razorpay</p>
        </div>
      </div>
    </div>
  );
};