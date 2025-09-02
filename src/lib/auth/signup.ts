import { supabase } from '../supabase/client';

export interface SignUpData {
  email: string;
  password: string;
  owner_name: string;
  restaurant_name: string;
  phone: string;
  address: string;
  upi_id: string;
}

/**
 * Signs up a new user. The restaurant profile is created automatically by a database trigger.
 * @param formData The user and restaurant details.
 */
export const signUpWithRestaurant = async (formData: SignUpData) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          owner_name: formData.owner_name,
          restaurant_name: formData.restaurant_name,
          phone: formData.phone,
          address: formData.address,
          upi_id: formData.upi_id,
        },
      },
    });

    if (error) {
      console.error('Signup failed:', error.message);

      // Provide more user-friendly errors
      if (error.message.includes('duplicate')) {
        throw new Error('This email is already registered. Please log in instead.');
      }

      if (error.message.includes('password')) {
        throw new Error('Your password is too weak. Please choose a stronger one.');
      }

      throw new Error('Signup failed. Please check your details and try again.');
    }

    return data?.user ?? null;
  } catch (err: any) {
    // Ensure we never leak raw error text
    throw new Error(err.message || 'Unexpected error during signup.');
  }
};
