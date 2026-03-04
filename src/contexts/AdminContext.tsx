import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

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

// Hardcoded admin email to maintain the single-password login UI
const ADMIN_EMAIL = 'admin@stroydom.com';

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (password: string) => {
    try {
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
      return true;
    } catch (error) {
      console.error('Firebase login failed:', error);
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Firebase logout failed:', error);
    }
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout: handleLogout, loading }}>
      {children}
    </AdminContext.Provider>
  );
};
