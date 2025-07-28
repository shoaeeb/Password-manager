'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Key, ArrowRight } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-6">
              <Shield className="h-8 w-8 text-primary-600" />
              <span className="text-sm font-semibold text-primary-600 uppercase tracking-wide">
                Zero-Knowledge Security
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Your passwords,
              <span className="text-primary-600"> completely secure</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Store, generate, and manage all your passwords with military-grade encryption. 
              Even we can't see your data - that's true zero-knowledge security.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={onGetStarted}
                className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="inline-flex items-center px-8 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition-colors">
                Watch Demo
              </button>
            </div>
            
            <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                AES-256 Encryption
              </div>
              <div className="flex items-center">
                <Key className="h-4 w-4 mr-2" />
                Zero-Knowledge
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Open Source
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Lock className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Gmail Account</div>
                    <div className="text-sm text-gray-500">john@example.com</div>
                  </div>
                  <div className="text-xs text-green-600 font-medium">Encrypted</div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Key className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Banking Portal</div>
                    <div className="text-sm text-gray-500">••••••••••••</div>
                  </div>
                  <div className="text-xs text-green-600 font-medium">Secured</div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Social Media</div>
                    <div className="text-sm text-gray-500">Strong password</div>
                  </div>
                  <div className="text-xs text-green-600 font-medium">Protected</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-100 rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-200 rounded-full opacity-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};