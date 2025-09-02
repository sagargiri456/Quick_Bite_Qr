export interface Restaurant {
  id: string
  restaurant_name: string
  slug: string
  user_id: string
  created_at: string
  updated_at?: string
  description?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  logo_url?: string
  banner_url?: string
  is_active?: boolean
  upi_id?: string
  qr_url?: string
  owner_name?: string
}
