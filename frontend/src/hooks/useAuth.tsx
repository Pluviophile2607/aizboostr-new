import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import api from '@/api/axios';

interface User {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  pendingPayment?: {
    amount: number;
    isPending: boolean;
    originalPaymentId: string;
    productDetails: any[];
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: any) => Promise<void>;
  signInWithGoogle: (token: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token) {
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            try {
                // Verify token and get fresh user data including pending payments
                const response = await api.get('/auth/me');
                const freshUser = response.data;
                console.log("Auth refreshed:", freshUser);
                setUser(freshUser);
                localStorage.setItem('user', JSON.stringify(freshUser));
            } catch (error) {
                console.error("Session verification failed", error);
                // If token is invalid, logout
                logout();
            }
        }
        setLoading(false);
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    } catch (error) {
        throw error;
    }
  };

  const signUp = async (data: any) => {
      try {
        const response = await api.post('/auth/register', data);
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
      } catch (error) {
          throw error;
      }
  };

  const signInWithGoogle = async (token: string) => {
    try {
        const response = await api.post('/auth/google-login', { token });
        const { token: jwtToken, user } = response.data;
        
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    } catch (error) {
        throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
      try {
          const response = await api.put('/auth/update-profile', data);
          const { user } = response.data;
          
          localStorage.setItem('user', JSON.stringify(user));
          setUser(user);
      } catch (error) {
          throw error;
      }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
