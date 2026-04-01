'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      // PKCE : échange le code avec le même client Supabase (partage le code_verifier en localStorage)
      const code = new URLSearchParams(window.location.search).get('code');
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error('[Auth callback] PKCE error:', error.message);
          router.replace('/connexion?error=auth_failed');
          return;
        }
        router.replace('/dashboard');
        return;
      }

      // Implicit flow : token dans le hash (#access_token=...)
      const hash = new URLSearchParams(window.location.hash.replace('#', ''));
      const accessToken = hash.get('access_token');
      if (accessToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: hash.get('refresh_token') || '',
        });
        if (error) {
          console.error('[Auth callback] Implicit error:', error.message);
          router.replace('/connexion?error=auth_failed');
          return;
        }
        router.replace('/dashboard');
        return;
      }

      // Déjà connecté ?
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace('/dashboard');
      } else {
        router.replace('/connexion');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 text-sm">Connexion en cours...</p>
      </div>
    </div>
  );
}
