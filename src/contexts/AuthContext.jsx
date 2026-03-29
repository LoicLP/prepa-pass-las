'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext();

/**
 * Normalise l'objet user Supabase pour garder la même API que Firebase
 * → user.displayName, user.email restent accessibles partout
 */
function normalizeUser(supabaseUser) {
  if (!supabaseUser) return null;
  return {
    ...supabaseUser,
    displayName: supabaseUser.user_metadata?.full_name || null,
    email: supabaseUser.email,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si Supabase n'est pas configuré (clés manquantes), on skip
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Récupérer la session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(normalizeUser(session?.user ?? null));
      setLoading(false);
    });

    // Écouter les changements d'état auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(normalizeUser(session?.user ?? null));
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (name, email, password) => {
    if (!supabase) throw new Error('Supabase non configuré');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });
    if (error) throw error;
    // Mettre à jour immédiatement avec le displayName
    if (data.user) {
      setUser(normalizeUser(data.user));
    }
  };

  const signIn = async (email, password) => {
    if (!supabase) throw new Error('Supabase non configuré');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signInWithGoogle = () => {
    if (!supabase) throw new Error('Supabase non configuré');
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : '';
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const oauthUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
    window.location.href = oauthUrl;
  };

  const logOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithGoogle, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
