import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// null when keys are missing — the site then falls back to the static content in data.js
export const supabase = url && key ? createClient(url, key) : null
export const isSupabaseReady = Boolean(supabase)
