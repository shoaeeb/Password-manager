import { useState } from 'react';
import { PasswordGeneratorOptions } from '@/types';

export const usePasswordGenerator = () => {
  const [options, setOptions] = useState<PasswordGeneratorOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
  });

  const generatePassword = (): string => {
    let charset = '';
    
    if (options.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.includeNumbers) charset += '0123456789';
    if (options.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (options.excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, '');
    }

    if (!charset) {
      throw new Error('At least one character type must be selected');
    }

    let password = '';
    for (let i = 0; i < options.length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return password;
  };

  const updateOptions = (newOptions: Partial<PasswordGeneratorOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  };

  return {
    options,
    updateOptions,
    generatePassword,
  };
};