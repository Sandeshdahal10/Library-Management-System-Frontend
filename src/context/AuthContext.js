import {createContext, useContext, useState, useEffect} from 'react';

const AuthContext = createContext();

export function AuthProvider({children}) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setUser(JSON.parse(user));
      setToken(token);
    }
    setLoading(false);
  },[])
  const login = (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    setToken(token);
  };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  }
  return (
    <AuthContext.Provider value={{user, token, login, logout, loading}}>
      {children}
    </AuthContext.Provider>
  );
  };

export const useAuth = () => useContext(AuthContext);
