
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = 'https://aozkvzccnqyrbaxjhack.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvemt2emNjbnF5cmJheGpoYWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1OTM5NTAsImV4cCI6MjA2MDE2OTk1MH0.ecde_uppyu-YgXEs_c4P_9ynnQpHbimZQmAxF3ZluhI';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage,
  },
});

// Types for user data from profiles table
export type UserProfile = {
  id: string;
  full_name?: string;
  role: 'owner' | 'cityManager' | 'admin' | 'customer';
  avatar?: string;  // Added avatar property
  email?: string;   // Added email property
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
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    throw new AuthError(error.message);
  }
  return session;
};

// Helper to get the current user profile with role
export const getUserProfile = async () => {
  const session = await getSession();
  if (!session?.user) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  // Include email from auth session in the profile
  return { 
    ...data as UserProfile,
    email: session.user.email 
  };
};
