import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

// This client bypasses RLS - use only in admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
