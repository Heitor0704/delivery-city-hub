
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

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
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Function to fetch user profile data from usuarios table
  const getUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('nome_usuario, tipo_usuario')
        .eq('user_id', supabaseUser.id)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      // Map tipo_usuario to UserRole
      let role: UserRole = 'owner';
      if (data.tipo_usuario === 'admin') {
        role = 'admin';
      } else if (data.tipo_usuario === 'cityManager') {
        role = 'cityManager';
      }

      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: data.nome_usuario || supabaseUser.email?.split('@')[0] || '',
        role,
        avatar: supabaseUser.user_metadata?.avatar_url
      };
    } catch (error) {
      console.error("Error in getUserProfile:", error);
      return null;
    }
  };

  // Set up auth state listener
  useEffect(() => {
    setIsLoading(true);
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Defer Supabase calls with setTimeout to prevent deadlock
          setTimeout(async () => {
            const profile = await getUserProfile(session.user);
            setUser(profile);
            setIsLoading(false);
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        getUserProfile(session.user).then((profile) => {
          setUser(profile);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const profile = await getUserProfile(data.user);
        setUser(profile);
      }
    } catch (error: any) {
      console.error("Error logging in:", error.message);
      throw new Error(error.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: User) => {
    if (!user) return;

    try {
      // Update user metadata in Supabase Auth
      await supabase.auth.updateUser({
        data: {
          name: userData.name,
          avatar_url: userData.avatar
        }
      });

      // Update user data in usuarios table
      const { error } = await supabase
        .from('usuarios')
        .update({
          nome_usuario: userData.name
        })
        .eq('user_id', userData.id);

      if (error) throw error;

      // Update local state
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Erro ao atualizar perfil");
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
