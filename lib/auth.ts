import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateSalt } from './crypto';

const JWT_SECRET = process.env.JWT_SECRET!;

// Hash master password with salt for server storage
export const hashMasterPassword = async (masterPassword: string, salt?: string): Promise<{ hash: string; salt: string }> => {
  const passwordSalt = salt || generateSalt();
  const hash = await bcrypt.hash(masterPassword + passwordSalt, 12);
  return { hash, salt: passwordSalt };
};

// Verify master password
export const verifyMasterPassword = async (
  masterPassword: string,
  salt: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(masterPassword + salt, hash);
};

// Generate JWT token
export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Verify JWT token
export const verifyToken = (token: string): { userId: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    return null;
  }
};

// Extract token from request headers
export const getTokenFromHeaders = (authHeader?: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};