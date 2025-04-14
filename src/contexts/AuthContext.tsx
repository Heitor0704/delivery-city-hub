
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, UserProfile, AuthError } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [session, setSession] = useState<Session | null>(null);
  const isAuthenticated = !!user;

  // Initialize auth state from localStorage and set up listener
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Defer profile fetch with setTimeout to avoid deadlocks
          setTimeout(async () => {
            try {
              const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
              if (error) throw error;
              
              // Merge auth data (email) with profile data
              setUser({
                ...data as UserProfile,
                email: session.user.email
              });
            } catch (error) {
              console.error('Error fetching profile:', error);
              setUser(null);
            }
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error('Error fetching profile:', error);
              return;
            }
            
            // Merge auth data with profile data
            setUser({
              ...data as UserProfile,
              email: session.user.email
            });
          });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Function to handle login
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw new AuthError(error.message);
      
      // The profile will be set by the onAuthStateChange listener
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error instanceof Error ? error.message : "Falha no login");
      throw error;
    }
  };

  // Function to handle logout
  const logout = () => {
    supabase.auth.signOut().then(() => {
      setUser(null);
      toast.success("Sessão encerrada");
    });
  };

  // Function to update user data
  const updateUser = (userData: UserProfile) => {
    setUser(userData);
    
    // Also update in database if this contains profile data
    if (userData.id) {
      const { email, ...profileData } = userData;
      
      supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userData.id)
        .then(({ error }) => {
          if (error) {
            console.error('Error updating profile:', error);
            toast.error("Erro ao atualizar o perfil");
          }
        });
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
