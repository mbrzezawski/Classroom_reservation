import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../api";
import type { RoleType } from "../types/user-role";

type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: RoleType;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  useEffect(() => {
    if (token) {
      fetchUser(token);
    }
  }, [token]);

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Nie udało się pobrać danych usera");

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("fetchUser error:", err);
      logout();
    }
  };

  const login = async (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    await fetchUser(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth musi być używany w AuthProviderze");
  return context;
};
