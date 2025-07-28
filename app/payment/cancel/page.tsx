'use client';

import { useRouter } from 'next/navigation';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function PaymentCancel() {
  const router = useRouter();

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
            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <XCircle className="h-12 w-12 text-red-600" />
          </motion.div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Cancelled
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your subscription payment was cancelled. No charges have been made to your account.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-gray-600 space-y-1 text-left">
              <li>• Your account remains on the free plan</li>
              <li>• You can still store up to 25 passwords</li>
              <li>• Upgrade anytime from your dashboard</li>
              <li>• All your data is safe and secure</li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </button>

            <button
              onClick={() => router.push('/')}
              className="w-full flex items-center justify-center space-x-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <CreditCard className="h-4 w-4" />
              <span>Try Again Later</span>
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Need help? Contact our support team anytime
          </p>
        </div>
      </motion.div>
    </div>
  );
}