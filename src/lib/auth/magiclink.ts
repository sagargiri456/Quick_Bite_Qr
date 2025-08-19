import supabase from "../supabase/client"

const sendMagicLink = async (email: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: 'https://yourdomain.com/dashboard',
    },
  })
  return { data, error }
}
