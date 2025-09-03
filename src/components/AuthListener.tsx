'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function AuthListener() {
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // ✅ Send session to Next.js API so it sets cookies
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // important for cookies
        body: JSON.stringify({ event, session }),
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
