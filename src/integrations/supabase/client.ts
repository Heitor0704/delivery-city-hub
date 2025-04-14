
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = 'https://aozkvzccnqyrbaxjhack.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvemt2emNjbnF5cmJheGpoYWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1OTM5NTAsImV4cCI6MjA2MDE2OTk1MH0.ecde_uppyu-YgXEs_c4P_9ynnQpHbimZQmAxF3ZluhI';

// Create the Supabase client with explicit storage options
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage,
    detectSessionInUrl: true, // Detect session in URL query params
  },
});

// Types for user data from profiles table
export type UserProfile = {
  id: string;
  full_name?: string;
  role: 'owner' | 'cityManager' | 'admin' | 'customer';
  email?: string; // Add email for easier reference
};

// Custom error type for authentication errors
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

// Helper to get the current session
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error getting session:", error);
      throw new AuthError(error.message);
    }
    return session;
  } catch (error) {
    console.error("Unexpected error in getSession:", error);
    return null;
  }
};

// Helper to get the current user profile with role
export const getUserProfile = async () => {
  try {
    const session = await getSession();
    if (!session?.user) {
      console.log("No active session found");
      return null;
    }
    
    console.log("Fetching profile for user:", session.user.id);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    // Enhance the profile with email from the session
    const profile = {
      ...data,
      email: session.user.email
    } as UserProfile;
    
    return profile;
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return null;
  }
};
