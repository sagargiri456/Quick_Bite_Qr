// src/app/dashboard/profile/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { updateProfile } from '@/lib/api/profile';
import RestaurantProfile from '@/components/RestaurantProfile';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { Restaurant } from '@/lib/types/types';

export default function RestaurantProfilePage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          throw new Error('You must be logged in to view this page.');
        }

        const { data, error: dbError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (dbError) {
          throw new Error('Could not fetch your restaurant profile. Please try again.');
        }

        if (data) {
          setRestaurant(data);
        } else {
          throw new Error('No restaurant profile found for your account.');
        }
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'An error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, []);

  const handleUpdateProfile = async (updatedData: Partial<Restaurant>) => {
    if (!restaurant) throw new Error("No restaurant to update.");
    
    const data = await updateProfile(updatedData as unknown as Partial<import('@/types/restaurant').Restaurant>);
    setRestaurant(data as Restaurant);
  };

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="p-4">
        <Alert>
          <AlertDescription>No restaurant profile was found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return <RestaurantProfile restaurant={restaurant} onUpdate={handleUpdateProfile} />;
}