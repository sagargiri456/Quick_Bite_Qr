// src/components/AuthListener.tsx
'use client';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function AuthListener() {
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // safe network call with timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);

        try {
          // This hits supabase auth endpoint; will throw on network failure
          const { data, error } = await supabase.auth.getSession({ signal: controller.signal } as any);
          if (error) {
            console.warn('AuthListener: getSession returned error:', error);
          }
        } finally {
          clearTimeout(timeout);
        }
      } catch (err: any) {
        console.error('AuthListener network error (failed to reach Supabase):', err?.message ?? err);
      }

      try {
        const { data: sub } = supabase.auth.onAuthStateChange((_event, _session) => {
          // handle changes if needed
        });
        // cleanup
        return () => {
          mounted = false;
          if (sub?.subscription?.unsubscribe) sub.subscription.unsubscribe();
        };
      } catch (err) {
        console.error('AuthListener: subscribe error', err);
      }
    })();

    return () => { mounted = false; };
  }, []);

  return null;
}
