import { getCurrentUser } from '@/lib/appwrite/api';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const INITIAL_USER = {
  id: '',
  name: '',
  email: '',
  imageUrl: '',
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false,
};

const AuthContext = createContext(INITIAL_STATE);

const AuthProvider = ({ children }) => {

  const navigate = useNavigate();

  const [user, setUser] = useState(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser();
      if (currentAccount){
        setUser({
          id: currentAccount.id,
          name: currentAccount.name,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
        })
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cookieFallback = localStorage.getItem('cookieFallback');
    if (cookieFallback === "[]" || cookieFallback === null || cookieFallback === undefined){
      navigate('/signin');
    }
    checkAuthUser();
  }, [])

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return (
    <AuthContext.Provider value={value} >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);