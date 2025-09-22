
import { useState, useEffect } from 'react';
import { User } from '../types';

// Mock authentication hook
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const checkAuth = async () => {
      try {
        // In a real app, this would check for stored tokens/session
        const storedUser = localStorage?.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.log('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, role: 'client' | 'admin') => {
    setIsLoading(true);
    try {
      // Mock login - in real app, this would call your auth service
      const mockUser: User = {
        id: role === 'admin' ? 'admin-1' : 'client-1',
        name: role === 'admin' ? 'Dr. Jolene Dawn' : 'Sarah Johnson',
        email,
        role,
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);
      localStorage?.setItem('user', JSON.stringify(mockUser));
      return { success: true };
    } catch (error) {
      console.log('Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage?.removeItem('user');
  };

  return {
    user,
    isLoading,
    login,
    logout,
  };
};
