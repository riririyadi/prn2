import { createContext, useContext, useState } from 'react';

interface ContextState {
  // set the type of state you want to handle with context e.g.
  user: any | null;
  login: (user: any) => void;
  logout: () => void;
}

const AuthContext = createContext({} as ContextState);

export const AuthProvider = ({ children }: { children: any }) => {
  const storedUser = localStorage.getItem('user_data');
  const userPersisted = storedUser ? JSON.parse(storedUser) : null;

  const [user, setUser] = useState(userPersisted);

  const login = (user: any) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
