import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { setToken, getToken, removeToken } from '../utils/token';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser({
        ...response.data,
        name: response.data.fullName || response.data.name, // Ensure 'name' exists
      });
    } catch (error) {
      removeToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      setToken(response.data.token);
      setUser({
        _id: response.data._id,
        fullName: response.data.fullName || response.data.name,
        name: response.data.fullName || response.data.name,
        email: response.data.email,
        role: response.data.role,
        skills: response.data.skills || [],
      });
      return { success: true };
    } catch (error) {
      let message = 'Login failed';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (!error.response) {
        message = 'Cannot reach server. Make sure the server is running (port 5000) and MongoDB is running.';
      }
      return { success: false, message };
    }
  };

  const register = async (fullName, email, password, confirmPassword) => {
    try {
      const response = await api.post('/auth/register', {
        fullName,
        email,
        password,
        confirmPassword,
      });
      setToken(response.data.token);
      setUser({
        _id: response.data._id,
        fullName: response.data.fullName,
        name: response.data.fullName, // Keep 'name' for backward compatibility
        email: response.data.email,
        role: response.data.role,
        skills: response.data.skills || [],
      });
      return { success: true };
    } catch (error) {
      let message = 'Registration failed';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (!error.response) {
        message = 'Cannot reach server. Make sure the server is running (port 5000) and MongoDB is running.';
      } else if (error.response?.data) {
        message = typeof error.response.data === 'string' ? error.response.data : message;
      }
      return { success: false, message };
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  const updateRoleAndSkills = async (role, skills) => {
    try {
      const response = await api.put('/auth/role-skills', { role, skills });
      setUser(prevUser => ({
        ...prevUser,
        role: response.data.role,
        skills: response.data.skills || [],
      }));
      return { success: true };
    } catch (error) {
      let message = 'Failed to update role and skills';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (!error.response) {
        message = 'Cannot reach server. Check if server is running on port 5000.';
      }
      return { success: false, message };
    }
  };

  const deleteAccount = async (password) => {
    try {
      await api.delete('/auth/account', { data: { password } });
      removeToken();
      setUser(null);
      return { success: true };
    } catch (error) {
      let message = 'Failed to delete account';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateRoleAndSkills,
    deleteAccount,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};




