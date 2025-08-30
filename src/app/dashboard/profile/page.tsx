// src/app/dashboard/profile/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import RestaurantProfile from '@/components/RestaurantProfile'; // Use the well-built component
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { Restaurant } from '@/lib/types/types'; // Import the correct type

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
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, []);

  // Handler for updating the restaurant data
  const handleUpdateProfile = async (updatedData: Partial<Restaurant>) => {
    if (!restaurant) throw new Error("No restaurant to update.");

    const { data, error } = await supabase
      .from('restaurants')
      .update(updatedData)
      .eq('id', restaurant.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Update the local state to reflect the changes immediately
    setRestaurant(data as Restaurant);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!restaurant) {
    return (
        <Alert>
          <AlertDescription>No restaurant profile was found.</AlertDescription>
        </Alert>
    );
  }

  return <RestaurantProfile restaurant={restaurant} onUpdate={handleUpdateProfile} />;
}