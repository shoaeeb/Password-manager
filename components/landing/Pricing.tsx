'use client';

import { motion } from 'framer-motion';
import { Check, Star, Crown } from 'lucide-react';

interface PricingProps {
  onUpgrade: () => void;
  onGetStarted: () => void;
}

export const Pricing = ({ onUpgrade, onGetStarted }: PricingProps) => {
  const features = {
    free: [
      'Up to 25 passwords',
      'Basic password generator',
      'AES-256 encryption',
      'Cross-device sync',
      'Email support'
    ],
    pro: [
      'Unlimited passwords',
      'Advanced password generator',
      'AES-256 encryption',
      'Cross-device sync',
      'Priority support',
      'Password sharing',
      'Advanced search',
      'Export functionality',
      'Security reports'
    ]
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                $0
                <span className="text-lg font-normal text-gray-500">/month</span>
              </div>
              <p className="text-gray-600">Perfect for getting started</p>
            </div>

            <ul className="space-y-4 mb-8">
              {features.free.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={onGetStarted}
              className="w-full py-3 px-6 border-2 border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
            >
              Get Started Free
            </button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 border-2 border-primary-600 relative"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                <Crown className="h-4 w-4 mr-1" />
                Most Popular
              </div>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                $3
                <span className="text-lg font-normal text-gray-500">/month</span>
              </div>
              <p className="text-gray-600">For power users and teams</p>
            </div>

            <ul className="space-y-4 mb-8">
              {features.pro.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={onUpgrade}
              className="w-full py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
            >
              Upgrade to Pro
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-2 text-yellow-400" />
              30-day money back guarantee
            </div>
            <div>Cancel anytime</div>
            <div>No setup fees</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};