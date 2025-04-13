
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
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        
        if (currentSession?.user) {
          await fetchUserData(currentSession.user);
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log("Got session:", currentSession?.user?.id);
      setSession(currentSession);
      
      if (currentSession?.user) {
        await fetchUserData(currentSession.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch additional user data from Usuarios table
  const fetchUserData = async (authUser: User) => {
    try {
      console.log("Fetching user data for email:", authUser.email);
      
      const { data, error } = await supabase
        .from('Usuarios')
        .select('*')
        .eq('email', authUser.email)
        .single();

      console.log("User data query result:", data, error);

      if (error) {
        console.error("Error fetching user data:", error);
        toast.error("Erro ao carregar dados do usuário");
        return;
      }

      if (data) {
        const userData = data as UserData;
        console.log("Usuarios data:", userData);
        console.log("tipo_usuario:", userData.tipo_usuario);
        
        // Map tipo_usuario directly to UserRole
        let role: UserRole;
        
        // Map the tipo_usuario value to our application roles
        if (userData.tipo_usuario === "admin") {
          role = "admin";
        } else if (userData.tipo_usuario === "cityManager" || userData.tipo_usuario === "gerente") {
          role = "cityManager";
        } else {
          role = "owner"; // default or owner type
        }

        console.log("Mapped role:", role);

        // Set user state with combined data
        const authUserData = {
          id: userData.user_id,
          email: userData.email || authUser.email || "",
          name: userData.nome_usuario || "",
          role,
          // No avatar in Usuarios table, so not setting it
        };
        
        console.log("Setting user state:", authUserData);
        setUser(authUserData);
      } else {
        console.error("No user data found for email:", authUser.email);
        toast.error("Usuário não encontrado");
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
      
      console.log("Login successful:", data);
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
