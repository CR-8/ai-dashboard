"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const router = useRouter();

  // Check authentication status on app load
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error in getSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Only redirect on sign out, not sign in (let components handle their own navigation)
        if (event === 'SIGNED_OUT') {
          router.push('/auth');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password,
      });

      if (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        return { success: true, user: data.user };
      }

      return { success: false, error: 'Login failed. Please try again.' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };
  const signup = async (userData) => {
    try {
      setLoading(true);
      const { email, password, firstName, lastName } = userData;
      
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password: password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            full_name: `${firstName.trim()} ${lastName.trim()}`.trim()
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        return { success: false, error: error.message };
      }

      if (data.user && !data.user.email_confirmed_at) {
        return { 
          success: true, 
          message: 'Please check your email for verification link.',
          verificationRequired: true,
          user: data.user
        };
      }

      if (data.user) {
        return { success: true, user: data.user };
      }

      return { success: false, error: 'Signup failed. Please try again.' };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Signup failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };
  const verifyEmail = async (token) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup'
      });

      if (error) {
        console.error('Email verification error:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        return { success: true, user: data.user };
      }

      return { success: false, error: 'Verification failed. Please try again.' };
    } catch (error) {
      console.error('Email verification error:', error);
      return { success: false, error: 'Verification failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const signInWithOAuth = async (provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        console.error('OAuth login error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('OAuth login error:', error);
      return { success: false, error: `${provider} login failed. Please try again.` };
    }
  };
  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      router.push('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      setLoading(true);
      
      // Update auth user data
      const { data, error } = await supabase.auth.updateUser({
        data: {
          first_name: updates.firstName,
          last_name: updates.lastName,
          full_name: `${updates.firstName || ''} ${updates.lastName || ''}`.trim()
        }
      });

      if (error) {
        console.error('Profile update error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Profile update failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.toLowerCase().trim(),
        {
          redirectTo: `${window.location.origin}/auth?mode=reset`
        }
      );

      if (error) {
        console.error('Password reset error:', error);
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        message: 'Password reset email sent. Please check your inbox.' 
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: 'Password reset failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (newPassword) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Password change error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, message: 'Password updated successfully!' };
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error: 'Password change failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };  const value = {
    // User state
    user,
    session,
    isAuthenticated: !!user,
    loading,
    
    // Auth methods
    login,
    signup,
    verifyEmail,
    signInWithOAuth,
    logout,
    updateProfile,
    resetPassword,
    changePassword,
    
    // User data accessors
    getUserData: () => user ? {
      id: user.id,
      email: user.email || '',
      firstName: user.user_metadata?.first_name || '',
      lastName: user.user_metadata?.last_name || '',
      fullName: user.user_metadata?.full_name || '',
      imageUrl: user.user_metadata?.avatar_url || '',
      emailVerified: !!user.email_confirmed_at
    } : null
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
