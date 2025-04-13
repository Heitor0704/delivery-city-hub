
import { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "admin" | "cityManager" | "owner";

interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Mock authentication state
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isAuthenticated = !!user;

  const login = async (email: string, password: string) => {
    // Mock login logic - in a real app, you would verify credentials with an API
    if (password !== "password") {
      throw new Error("Credenciais inválidas");
    }

    let role: UserRole = "owner";
    if (email.includes("admin")) {
      role = "admin";
    } else if (email.includes("manager")) {
      role = "cityManager";
    }

    const userData: User = {
      id: "user-1",
      email,
      name: "",
      role,
    };

    // Set the authenticated user
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
