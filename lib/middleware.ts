import { NextRequest } from 'next/server';
import { verifyToken, getTokenFromHeaders } from './auth';

export interface AuthenticatedRequest extends NextRequest {
  userId: string;
}

export const authenticate = (request: NextRequest): { userId: string } | null => {
  const authHeader = request.headers.get('authorization');
  const token = getTokenFromHeaders(authHeader || '');
  
  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  return decoded;
};