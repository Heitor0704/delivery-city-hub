
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";

type UserRole = "admin" | "cityManager" | "owner";

// This represents the user data from the Usuarios table
interface UserData {
  user_id: string;
  nome_usuario: string;
  email: string;
  telefone: string;
  tipo_usuario: string;
  documento: string;
  created_at: string;
  senha: string;
}

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
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const isAuthenticated = !!user;

  // Initialize auth state and listen for changes
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          fetchUserData(currentSession.user);
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        fetchUserData(currentSession.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch additional user data from Usuarios table
  const fetchUserData = async (authUser: User) => {
    try {
      const { data, error } = await supabase
        .from('Usuarios')
        .select('*')
        .eq('email', authUser.email)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
        toast.error("Erro ao carregar dados do usuário");
        return;
      }

      if (data) {
        const userData = data as UserData;
        
        // Map tipo_usuario to UserRole
        let role: UserRole = "owner"; // default
        if (userData.tipo_usuario?.includes("admin")) {
          role = "admin";
        } else if (userData.tipo_usuario?.includes("gerente") || userData.tipo_usuario?.includes("manager")) {
          role = "cityManager";
        }

        // Set user state with combined data
        setUser({
          id: userData.user_id,
          email: userData.email || authUser.email || "",
          name: userData.nome_usuario || "",
          role,
          // No avatar in Usuarios table, so not setting it
        });
      }
    } catch (error) {
      console.error("Error in fetchUserData:", error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw new Error(error.message);
      
      // The user data will be fetched by the onAuthStateChange listener
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout error:", error);
    }
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
        session,
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
