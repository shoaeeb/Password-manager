import CryptoJS from 'crypto-js';
import { DecryptedPasswordData } from '@/types';

// Client-side encryption using AES-256
export const encryptData = (data: DecryptedPasswordData, masterPassword: string): string => {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, masterPassword).toString();
    return encrypted;
  } catch (error) {
    throw new Error('Encryption failed');
  }
};

// Client-side decryption
export const decryptData = (encryptedData: string, masterPassword: string): DecryptedPasswordData => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, masterPassword);
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!jsonString) {
      throw new Error('Invalid master password');
    }
    
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error('Decryption failed - Invalid master password');
  }
};

// Generate a cryptographically secure salt
export const generateSalt = (): string => {
  return CryptoJS.lib.WordArray.random(32).toString();
};

// Derive encryption key from master password and salt
export const deriveKey = (masterPassword: string, salt: string): string => {
  return CryptoJS.PBKDF2(masterPassword, salt, {
    keySize: 256/32,
    iterations: 10000
  }).toString();
};

// Password strength checker
export const checkPasswordStrength = (password: string): {
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('Use at least 8 characters');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Include lowercase letters');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Include uppercase letters');

  if (/\d/.test(password)) score += 1;
  else feedback.push('Include numbers');

  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push('Include special characters');

  return { score, feedback };
};