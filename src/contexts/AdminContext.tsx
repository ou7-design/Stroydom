import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

interface AdminContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Configure axios to send cookies
  axios.defaults.withCredentials = true;

  useEffect(() => {
    // Basic check - in a real app you'd verify the token on the server
    const checkAuth = () => {
      const isAuth = localStorage.getItem('isAdminAuth') === 'true';
      setIsAuthenticated(isAuth);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (password: string) => {
    try {
      const url = `http://localhost:5000/api/auth/login`;
      console.log('Attempting login at:', url);
      await axios.post(url, { password });
      setIsAuthenticated(true);
      localStorage.setItem('isAdminAuth', 'true');
      return true;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
      setIsAuthenticated(false);
      localStorage.removeItem('isAdminAuth');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AdminContext.Provider>
  );
};
