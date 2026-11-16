import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo
} from "react";
import { authService } from '../services/authService';

const AuthContext = createContext(null);

function readStoredUser() {
  try { return JSON.parse(localStorage.getItem('user') || 'null'); }
  catch { localStorage.removeItem('user'); return null; }
}


export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );

  async function login(credentials) {
    setLoading(true);

    try {
      const data = await authService.login(credentials);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      return data.user;
    } finally {
      setLoading(false);
    }
  }

  async function register(values) {
    setLoading(true);

    try {
      return await authService.register(values);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({
    user,
    token,
    loading,
    login,
    register,
    logout
  }), [user, token, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return context;
}
