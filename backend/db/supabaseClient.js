// db/supabaseClient.js
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials:')
  console.error('SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
  console.error('SUPABASE_SERVICE_KEY:', supabaseKey ? 'Set' : 'Missing')
  throw new Error('Supabase credentials are not properly configured')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
