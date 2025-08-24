import { supabase } from '../supabase/client';

export interface SignUpData {
  email:          string;
  password:       string;
  owner_name:     string;
  restaurant_name: string;
  phone:          string;
  address:        string;
  upi_id:         string;
}

/**
 * Signs up a new user. The restaurant profile is created automatically by a database trigger.
 * @param formData The user and restaurant details.
 */
export const signUpWithRestaurant = async (formData: SignUpData) => {
  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    // Pass the restaurant details as metadata. The trigger will use this.
    options: {
      data: {
        owner_name: formData.owner_name,
        restaurant_name: formData.restaurant_name,
        phone: formData.phone,
        address: formData.address,
        upi_id: formData.upi_id,
      }
    }
  });

  if (error) {
    console.error("Error signing up user:", error.message);
    throw new Error(`Could not sign up: ${error.message}`);
  }

  return data.user;
};
