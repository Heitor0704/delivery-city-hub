
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
    console.log("AuthProvider: Setting up auth state listener");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Defer profile fetch with setTimeout to avoid deadlocks
          setTimeout(async () => {
            try {
              console.log("Fetching profile for user:", currentSession.user.id);
              const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentSession.user.id)
                .single();
                
              if (error) {
                console.error('Error fetching profile:', error);
                setUser(null);
                return;
              }
              
              // Add email from session to profile data
              const profile = {
                ...data,
                email: currentSession.user.email
              } as UserProfile;
              
              console.log("Profile fetched successfully:", profile);
              setUser(profile);
            } catch (error) {
              console.error('Error in profile fetch:', error);
              setUser(null);
            }
          }, 0);
        } else {
          console.log("No session user, setting user to null");
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        console.log("Checking for existing session");
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          return;
        }
        
        setSession(existingSession);
        
        if (existingSession?.user) {
          console.log("Found existing session, fetching profile");
          try {
            const { data, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', existingSession.user.id)
              .single();
            
            if (profileError) {
              console.error('Error fetching profile:', profileError);
              return;
            }
            
            // Add email from session to profile data
            const profile = {
              ...data,
              email: existingSession.user.email
            } as UserProfile;
            
            console.log("Setting user from existing session:", profile);
            setUser(profile);
          } catch (error) {
            console.error('Error in initial profile fetch:', error);
          }
        }
      } catch (error) {
        console.error("Error in auth initialization:", error);
      }
    };
    
    initializeAuth();

    return () => {
      console.log("Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, []);

  // Function to handle login
  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw new AuthError(error.message);
      
      // The profile will be set by the onAuthStateChange listener
      console.log("Login successful for:", email);
      toast.success("Login realizado com sucesso!");
      // Return void instead of the data to match the function signature
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
    }).catch(error => {
      console.error("Logout error:", error);
      toast.error("Erro ao encerrar sessão");
    });
  };

  // Function to update user data
  const updateUser = (userData: UserProfile) => {
    setUser(userData);
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
