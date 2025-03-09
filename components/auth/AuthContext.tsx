'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  signOut: async () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const refreshUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error refreshing user:', error);
        setUser(null);
        setIsAdmin(false);
        return;
      }
      
      if (data?.user) {
        setUser(data.user);
        
        // Check if user is admin
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();
            
          setIsAdmin(profileData?.role === 'admin');
        } catch (err) {
          console.error('Error checking admin status:', err);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    } catch (err) {
      console.error('Unexpected error in refreshUser:', err);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Wrap in try-catch to handle cookie parsing errors
        try {
          await refreshUser();
        } catch (refreshError) {
          console.error('Error refreshing user, continuing without authentication:', refreshError);
          setUser(null);
          setIsAdmin(false);
          setIsLoading(false);
        }
        
        // Set up auth state change listener with error handling
        try {
          const { data: { subscription } } = await supabase.auth.onAuthStateChange(
            async (event: AuthChangeEvent, session: Session | null) => {
              if (session?.user) {
                try {
                  await refreshUser();
                } catch (refreshError) {
                  console.error('Error refreshing user on auth change:', refreshError);
                  setUser(null);
                  setIsAdmin(false);
                  setIsLoading(false);
                }
              } else {
                setUser(null);
                setIsAdmin(false);
                setIsLoading(false);
              }
            }
          );
          
          return () => {
            subscription.unsubscribe();
          };
        } catch (authChangeError) {
          console.error('Error setting up auth state change listener:', authChangeError);
          setUser(null);
          setIsAdmin(false);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setUser(null);
        setIsAdmin(false);
        setIsLoading(false);
      } finally {
        // Ensure loading state is always set to false after a short delay
        // This prevents the app from getting stuck in a loading state
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };
    
    checkUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
