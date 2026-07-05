'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Redirige un utilisateur connecté vers `to` (les pages publiques deviennent des vitrines).
export default function RedirectIfAuthed({ to }) {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user) router.replace(to);
  }, [user, to, router]);
  return null;
}
