
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
// Rename the imported User to SupabaseUser to avoid conflicts
import { User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "sonner";

// Define a type for the database user data structure 
interface UserData {
  created_at: string;
  documento: string | null;
  email: string | null; 
  nome_usuario: string | null;
  senha: string | null; 
  telefone: string | null;
  tipo_usuario: string | null;
  user_id: string;
  // Note: avatar is not defined in the Usuarios table
}

type UserRole = "admin" | "cityManager" | "owner";

// Define our custom User type that will be used throughout the app
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
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // Configurar o listener de autenticação do Supabase
  useEffect(() => {
    // Configurar o listener de mudança de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        
        if (currentSession?.user) {
          try {
            // Buscar dados do usuário do Supabase
            const { data: userData, error } = await supabase
              .from("Usuarios")
              .select("*")
              .eq("user_id", currentSession.user.id)
              .single();

            if (error) {
              console.error("Erro ao buscar dados do usuário:", error);
              return;
            }

            if (userData) {
              // Create our application User from the database UserData
              const userInfo: User = {
                id: currentSession.user.id,
                email: currentSession.user.email || "",
                name: userData.nome_usuario || currentSession.user.email?.split("@")[0] || "",
                role: userData.tipo_usuario as UserRole,
                // avatar is defined in our User interface but not in the database
                // so we don't set it here
              };
              
              setUser(userInfo);
              localStorage.setItem("user", JSON.stringify(userInfo));
            }
          } catch (error) {
            console.error("Erro ao processar autenticação:", error);
          }
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      }
    );

    // Verificar sessão atual ao carregar
    const checkCurrentSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession?.user) {
          // Buscar dados do usuário do Supabase
          const { data: userData, error } = await supabase
            .from("Usuarios")
            .select("*")
            .eq("user_id", currentSession.user.id)
            .single();

          if (error) {
            console.error("Erro ao buscar dados do usuário:", error);
            setLoading(false);
            return;
          }

          if (userData) {
            const userInfo: User = {
              id: currentSession.user.id,
              email: currentSession.user.email || "",
              name: userData.nome_usuario || currentSession.user.email?.split("@")[0] || "",
              role: userData.tipo_usuario as UserRole,
              // avatar is defined in our User interface but not in the database
              // so we don't set it here
            };
            
            setUser(userInfo);
            localStorage.setItem("user", JSON.stringify(userInfo));
          }
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      } finally {
        setLoading(false);
      }
    };

    checkCurrentSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Erro de login:", error.message);
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error("Não foi possível autenticar o usuário");
      }

      // A atualização do user state será feita pelo listener onAuthStateChange
      console.log("Login bem-sucedido para:", email);
      return;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Erro ao fazer logout:", error);
        toast.error("Erro ao fazer logout");
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

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
