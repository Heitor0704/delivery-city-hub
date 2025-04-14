
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, UserProfile, AuthError } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  // Handle navigation based on user role
  useEffect(() => {
    if (user) {
      console.log("Redirecting authenticated user with role:", user.role);
      
      switch (user.role) {
        case "owner":
          console.log("Redirecting to owner dashboard");
          navigate('/owner-dashboard', { replace: true });
          break;
        case "cityManager":
          console.log("Redirecting to city manager dashboard");
          navigate('/city-manager-dashboard', { replace: true });
          break;
        case "admin":
          console.log("Redirecting to admin dashboard");
          navigate('/admin-dashboard', { replace: true });
          break;
        default:
          // Only redirect if on the login page
          if (window.location.pathname === '/') {
            console.log("Unknown role, staying on current page");
          }
      }
    }
  }, [user, navigate]);

  // Initialize auth state from localStorage and set up listener
  useEffect(() => {
    console.log("AuthProvider: Initializing auth state");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
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
                .maybeSingle();
                
              if (error) {
                console.error('Error fetching profile:', error);
                // Try to use metadata as fallback if available
                if (session.user.user_metadata?.role) {
                  const userProfile = {
                    id: session.user.id,
                    role: session.user.user_metadata.role,
                    full_name: session.user.user_metadata.full_name,
                    email: session.user.email
                  };
                  
                  console.log("Using user metadata as fallback:", userProfile);
                  setUser(userProfile);
                  return;
                }
                
                // If we have no profile and no metadata, handle gracefully
                if (!data) {
                  toast.error("Perfil de usuário não encontrado.");
                  setUser(null);
                  supabase.auth.signOut(); // Log out if no profile found
                  return;
                }
                
                throw error;
              }
              
              if (data) {
                // Merge auth data (email) with profile data
                const userProfile = {
                  ...data as UserProfile,
                  email: session.user.email
                };
                
                console.log("Setting user profile:", userProfile);
                setUser(userProfile);
              } else {
                console.warn("No profile data returned but also no error");
                // Check metadata as fallback
                if (session.user.user_metadata?.role) {
                  setUser({
                    id: session.user.id,
                    role: session.user.user_metadata.role,
                    full_name: session.user.user_metadata.full_name,
                    email: session.user.email
                  });
                  console.log("Using metadata for profile:", session.user.user_metadata);
                } else {
                  toast.error("Não foi possível carregar seu perfil.");
                  setUser(null);
                }
              }
            } catch (error) {
              console.error('Error processing profile:', error);
              toast.error("Erro ao carregar perfil de usuário");
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
          .maybeSingle()
          .then(({ data, error }) => {
            if (error) {
              console.error('Error fetching initial profile:', error);
              
              // Use metadata as fallback if available
              if (session.user.user_metadata?.role) {
                const userProfile = {
                  id: session.user.id,
                  role: session.user.user_metadata.role,
                  full_name: session.user.user_metadata.full_name,
                  email: session.user.email
                };
                
                console.log("Using metadata for initial user:", userProfile);
                setUser(userProfile);
                return;
              }
              
              toast.error("Erro ao carregar perfil");
              return;
            }
            
            if (data) {
              // Merge auth data with profile data
              const userProfile = {
                ...data as UserProfile,
                email: session.user.email
              };
              
              console.log("Setting initial user profile:", userProfile);
              setUser(userProfile);
            } else {
              console.warn("No initial profile data found");
              
              // Use metadata as fallback
              if (session.user.user_metadata?.role) {
                setUser({
                  id: session.user.id,
                  role: session.user.user_metadata.role,
                  full_name: session.user.user_metadata.full_name,
                  email: session.user.email
                });
                console.log("Using metadata for initial user fallback");
              } else {
                toast.error("Perfil não encontrado");
                supabase.auth.signOut();
              }
            }
          });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Function to handle login
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw new AuthError(error.message);
      
      // The profile will be set by the onAuthStateChange listener
      console.log("Login successful, waiting for session change");
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
