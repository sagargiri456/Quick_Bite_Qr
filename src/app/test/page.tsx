import { supabase } from '@/lib/supabase/client'

export default async function TestPage() {
  const { data, error } = await supabase.from('restaurants').select('*').limit(1)

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Supabase Test</h1>
      {error && <p>Error: {error.message}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}
