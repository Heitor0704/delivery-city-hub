
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

type UserRole = "admin" | "cityManager" | "owner";

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: AuthUser) => void;
}

// Demo users for testing without Supabase
const demoUsers = [
  {
    id: "1",
    email: "owner@example.com",
    name: "Restaurant Owner",
    role: "owner" as UserRole,
    password: "password",
  },
  {
    id: "2",
    email: "city@example.com",
    name: "City Manager",
    role: "cityManager" as UserRole,
    password: "password",
  },
  {
    id: "3",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin" as UserRole,
    password: "password",
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const isAuthenticated = !!user;

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Find user in demo data
      const demoUser = demoUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!demoUser) {
        throw new Error("Email ou senha inválidos");
      }

      // Create auth user object (excluding password)
      const { password: _, ...authUser } = demoUser;
      
      // Update state and persist to localStorage
      setUser(authUser);
      localStorage.setItem("user", JSON.stringify(authUser));
      
      toast.success("Login realizado com sucesso!");
      return;
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error instanceof Error ? error.message : "Falha no login");
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Sessão encerrada");
  };

  const updateUser = (userData: AuthUser) => {
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
