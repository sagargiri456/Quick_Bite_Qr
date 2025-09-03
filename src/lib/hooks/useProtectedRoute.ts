'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth/session';

/**
 * Redirects to /login if user is not authenticated.
 */
export const useProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { session } = await getSession();

      if (!session) {
        router.replace('/login');
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { loading };
};
