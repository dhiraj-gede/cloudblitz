import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '../contexts/auth-contxt.ts';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  // Ensure refreshUser is always present (fallback to noop if not)
  if (!('refreshUser' in context)) {
    (context as AuthContextType).refreshUser = async () => Promise.resolve();
  }
  return context;
};
