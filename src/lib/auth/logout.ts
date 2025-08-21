import { supabase } from '../supabase/client'

export const logout = async () => {
  const { error } = await supabase.auth.signOut()
  return error
}
