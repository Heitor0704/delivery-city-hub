
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

// Define user profile type without Supabase dependency
export type UserRole = 'owner' | 'cityManager' | 'admin' | 'customer';

export interface UserProfile {
  id: string;
  full_name?: string;
  role: UserRole;
  email?: string;
  avatar?: string;
}

// Mock users for demonstration
const DEMO_USERS = [
  {
    email: "owner@fomex.com",
    password: "123456",
    profile: {
      id: "1",
      full_name: "João Silva",
      role: "owner" as UserRole,
      email: "owner@fomex.com",
      avatar: "/lovable-uploads/8724e30c-5320-4840-9c82-f95d7aa3af29.png"
    }
  },
  {
    email: "manager@fomex.com",
    password: "123456",
    profile: {
      id: "2",
      full_name: "Maria Oliveira",
      role: "cityManager" as UserRole,
      email: "manager@fomex.com",
      avatar: ""
    }
  },
  {
    email: "admin@fomex.com",
    password: "123456",
    profile: {
      id: "3",
      full_name: "Carlos Ferreira",
      role: "admin" as UserRole,
      email: "admin@fomex.com",
      avatar: ""
    }
  }
];

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const isAuthenticated = !!user;
  
  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('fomex_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('fomex_user');
      }
    }
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    try {
      // Find user in the mock data
      const foundUser = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!foundUser) {
        throw new Error("Credenciais inválidas");
      }

      // Set user in state and localStorage
      setUser(foundUser.profile);
      localStorage.setItem('fomex_user', JSON.stringify(foundUser.profile));
      
      console.log("Login successful for:", email);
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error instanceof Error ? error.message : "Falha no login");
      throw error;
    }
  };

  // Mock logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('fomex_user');
    toast.success("Sessão encerrada");
  };

  // Update user data
  const updateUser = (userData: UserProfile) => {
    setUser(userData);
    localStorage.setItem('fomex_user', JSON.stringify(userData));
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

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
