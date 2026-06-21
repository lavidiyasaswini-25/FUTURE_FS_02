import { createContext, useContext, useState } from 'react';
import { login as loginAPI, register as registerAPI } from '../api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const stored = localStorage.getItem('user');
  const [user, setUser] = useState(stored ? JSON.parse(stored) : null);

  const login = async (email, password) => {
    const { data } = await loginAPI({ email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const register = async (name, email, password) => {
    const { data } = await registerAPI({ name, email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
