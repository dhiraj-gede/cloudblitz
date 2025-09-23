import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

interface TokenPayload {
  userId: string;
}

interface TokenResponse {
  token: string;
  expiresIn: number;
}

/**
 * Generate an access token
 * @param user User for whom to generate token
 * @returns Access token data
 */
export const generateAccessToken = (user: IUser): TokenResponse => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  const expiresIn = parseInt(process.env.JWT_ACCESS_EXPIRES || '3600', 10); // 1 hour default

  const token = jwt.sign(
    { userId: user.id } as TokenPayload,
    secret,
    { expiresIn }
  );

  return {
    token,
    expiresIn,
  };
};

/**
 * Generate a refresh token
 * @param user User for whom to generate token
 * @returns Refresh token data
 */
export const generateRefreshToken = (user: IUser): TokenResponse => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
  }
  
  const expiresIn = parseInt(process.env.JWT_REFRESH_EXPIRES || '604800', 10); // 7 days default
  
  const token = jwt.sign(
    { userId: user.id } as TokenPayload,
    secret,
    { expiresIn }
  );

  return {
    token,
    expiresIn,
  };
};

/**
 * Verify access token
 * @param token The JWT token to verify
 * @returns The decoded token payload or null if invalid
 */
export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is not defined in environment variables');
      return null;
    }
    
    const decoded = jwt.verify(token, secret) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
};

/**
 * Verify refresh token
 * @param token The refresh token to verify
 * @returns The decoded token payload or null if invalid
 */
export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      console.error('JWT_REFRESH_SECRET is not defined in environment variables');
      return null;
    }
    
    const decoded = jwt.verify(token, secret) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
};