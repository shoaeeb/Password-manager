'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How secure is my data?',
      answer: 'Your data is protected with AES-256 encryption and zero-knowledge architecture. This means your passwords are encrypted on your device before being sent to our servers, and even we cannot access your unencrypted data.'
    },
    {
      question: 'What happens if I forget my master password?',
      answer: 'Due to our zero-knowledge security model, we cannot recover your master password. However, you can reset your account and start fresh. We recommend storing your master password in a secure location.'
    },
    {
      question: 'Can I import passwords from other managers?',
      answer: 'Yes! We support importing from most popular password managers including LastPass, 1Password, Bitwarden, and others. You can also import from CSV files.'
    },
    {
      question: 'Is there a limit to how many passwords I can store?',
      answer: 'Free accounts can store up to 25 passwords. Pro accounts ($3/month) have unlimited password storage plus additional features like advanced search and secure sharing.'
    },
    {
      question: 'How does the password generator work?',
      answer: 'Our password generator creates cryptographically secure passwords using customizable parameters including length, character sets, and complexity rules. All generation happens locally on your device.'
    },
    {
      question: 'Can I use this on multiple devices?',
      answer: 'Absolutely! Your encrypted passwords sync across all your devices. We support web browsers, mobile apps, and desktop applications with real-time synchronization.'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently asked questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about our password manager
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};