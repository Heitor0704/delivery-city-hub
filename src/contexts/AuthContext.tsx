
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
    console.log("AuthProvider: Initializing auth state");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("AuthStateChange event:", event, "Session:", session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Defer profile fetch with setTimeout to avoid deadlocks
          setTimeout(async () => {
            try {
              console.log("Fetching user profile for:", session.user?.email);
              const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
              if (error) {
                console.error('Error fetching profile:', error);
                // Try to use metadata as fallback if available
                if (session.user.user_metadata?.role) {
                  setUser({
                    id: session.user.id,
                    role: session.user.user_metadata.role,
                    full_name: session.user.user_metadata.full_name,
                    email: session.user.email
                  });
                  console.log("Using user metadata as fallback:", session.user.user_metadata);
                  return;
                }
                throw error;
              }
              
              // Merge auth data (email) with profile data
              const userProfile = {
                ...data as UserProfile,
                email: session.user.email
              };
              
              console.log("Setting user profile:", userProfile);
              setUser(userProfile);
            } catch (error) {
              console.error('Error processing profile:', error);
              setUser(null);
            }
          }, 0);
        } else {
          console.log("No session, clearing user");
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.email);
      setSession(session);
      
      if (session?.user) {
        // Try to get profile data
        console.log("Checking for existing user profile");
        
        // Try to get profile from profiles table
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error('Error fetching initial profile:', error);
              
              // Use metadata as fallback if available
              if (session.user.user_metadata?.role) {
                setUser({
                  id: session.user.id,
                  role: session.user.user_metadata.role,
                  full_name: session.user.user_metadata.full_name,
                  email: session.user.email
                });
                console.log("Using metadata for initial user:", session.user.user_metadata);
                return;
              }
              
              return;
            }
            
            // Merge auth data with profile data
            const userProfile = {
              ...data as UserProfile,
              email: session.user.email
            };
            
            console.log("Setting initial user profile:", userProfile);
            setUser(userProfile);
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
