import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // ✅ Lazy initialization (prevents re-run on re-render)
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  // ✅ Login (optimized, avoids unnecessary re-renders)
  const login = useCallback(({ userData, accessToken }) => {
    const newUserString = JSON.stringify(userData);
    const currentUserString = JSON.stringify(user);

    if (currentUserString !== newUserString) {
      setUser(userData);
      localStorage.setItem("user", newUserString);
    }

    if (token !== accessToken) {
      setToken(accessToken);
      localStorage.setItem("token", accessToken);
    }
  }, [user, token]);

  // ✅ Logout (stable, no unnecessary updates)
  const logout = useCallback(() => {
    


    if (!user && !token) return; // prevent useless re-render

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
    setToken(null);
  }, [user, token]);

  const isAuthenticated = !!token;

  // ✅ Memoized context value (🔥 prevents re-render storms)
  const value = useMemo(() => ({
    user,
    token,
    login,
    logout,
    isAuthenticated,
  }), [user, token, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};