
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type UserRole = "admin" | "cityManager" | "owner";

interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  avatar?: string;
}

interface UserData {
  created_at: string;
  documento: string;
  email: string;
  nome_usuario: string;
  senha: string;
  telefone: string;
  tipo_usuario: string;
  user_id: string;
  avatar?: string; // Propriedade avatar definida corretamente
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
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    // Verificar se já existe uma sessão ativa
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        const { user: supabaseUser } = data.session;
        
        // Buscar dados do usuário na tabela Usuarios
        const { data: userData } = await supabase
          .from('Usuarios')
          .select('*')
          .eq('user_id', supabaseUser.id)
          .single();
          
        if (userData) {
          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            name: userData.nome_usuario || '',
            role: mapUserRole(userData.tipo_usuario),
            avatar: userData.avatar || undefined
          });
        }
      }
      
      setIsAuthenticating(false);
    };
    
    checkSession();
    
    // Inscrever-se nas mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && session.user) {
        const { data: userData } = await supabase
          .from('Usuarios')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (userData) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: userData.nome_usuario || '',
            role: mapUserRole(userData.tipo_usuario),
            avatar: userData.avatar || undefined
          });
        }
      } else {
        setUser(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Mapear tipo_usuario para role
  const mapUserRole = (tipo_usuario: string): UserRole => {
    switch (tipo_usuario) {
      case "admin":
        return "admin";
      case "gerente":
        return "cityManager";
      default:
        return "owner";
    }
  };

  const login = async (email: string, password: string) => {
    setIsAuthenticating(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // Buscar dados do usuário na tabela Usuarios
        const { data: userData } = await supabase
          .from('Usuarios')
          .select('*')
          .eq('user_id', data.user.id)
          .single();
          
        if (userData) {
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            name: userData.nome_usuario || '',
            role: mapUserRole(userData.tipo_usuario),
            avatar: userData.avatar || undefined
          });
        }
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const isAuthenticated = !!user;

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
