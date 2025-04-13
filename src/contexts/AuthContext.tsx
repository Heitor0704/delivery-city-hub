
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

type UserRole = "admin" | "cityManager" | "owner";

interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole; // This will store the tipo_usuario value
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: User) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Don't fetch profile directly in the callback to prevent deadlocks
          setTimeout(() => {
            fetchUserProfile(currentSession.user);
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Retrieved session:", currentSession ? "exists" : "none");
      setSession(currentSession);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile from the Usuarios table (with capital U)
  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      setIsLoading(true);
      console.log("Fetching user profile for:", supabaseUser.id);
      
      const { data, error } = await supabase
        .from('Usuarios')
        .select('nome_usuario, tipo_usuario')
        .eq('user_id', supabaseUser.id)
        .single();
      
      if (error) {
        console.error("Error fetching user profile:", error);
        setIsLoading(false);
        return;
      }
      
      if (data) {
        console.log("User profile fetched:", data);
        const userRole = data.tipo_usuario as UserRole;
        
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || "",
          name: data.nome_usuario || supabaseUser.email?.split('@')[0] || "",
          role: userRole, // Here we're using tipo_usuario as the role
        });
      } else {
        console.warn("No user profile found");
        // Fallback to basic user info
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || "",
          name: supabaseUser.email?.split('@')[0] || "",
          role: "owner", // Default role
        });
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Login error:", error);
        toast.error("Erro ao fazer login: " + (error.message === "Invalid login credentials" ? "Email ou senha inválidos" : error.message));
        throw error;
      }
      
      toast.success("Login bem-sucedido!");
      // We don't need to manually set the user here as the onAuthStateChange event will handle it
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      toast.success("Logout realizado com sucesso");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Erro ao fazer logout: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: User) => {
    if (!user) return;
    
    try {
      setUser({ ...user, ...userData });
    } catch (error: any) {
      console.error("Update user error:", error);
      toast.error("Erro ao atualizar usuário: " + error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        updateUser,
        isLoading
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
