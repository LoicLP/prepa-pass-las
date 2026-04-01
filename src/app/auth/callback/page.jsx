'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const handleCallback = async () => {
      const code = new URLSearchParams(window.location.search).get('code');
      if (code) {
        // PKCE : échange du code côté client (code_verifier est dans localStorage)
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error('[Auth callback] exchangeCodeForSession error:', error.message);
          router.push('/connexion?error=auth_failed');
          return;
        }
      }
      router.push('/dashboard');
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
