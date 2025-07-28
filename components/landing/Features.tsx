'use client';

import { motion } from 'framer-motion';
import { Shield, Key, Smartphone, Globe, Download, Users } from 'lucide-react';

export const Features = () => {
  const features = [
    {
      icon: Shield,
      title: 'Zero-Knowledge Security',
      description: 'Your data is encrypted before it leaves your device. Even we can\'t see your passwords.',
    },
    {
      icon: Key,
      title: 'Strong Password Generator',
      description: 'Generate unique, complex passwords with customizable length and character sets.',
    },
    {
      icon: Smartphone,
      title: 'Cross-Device Sync',
      description: 'Access your passwords securely across all your devices with real-time synchronization.',
    },
    {
      icon: Globe,
      title: 'Browser Integration',
      description: 'Auto-fill passwords in your browser with our secure browser extension.',
    },
    {
      icon: Download,
      title: 'Import & Export',
      description: 'Easily migrate from other password managers or backup your data.',
    },
    {
      icon: Users,
      title: 'Secure Sharing',
      description: 'Share passwords with team members using end-to-end encryption.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything you need to stay secure
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced security features designed to protect your digital life without compromising convenience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};