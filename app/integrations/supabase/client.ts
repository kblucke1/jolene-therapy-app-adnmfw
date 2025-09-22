import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://zrudmvgsdglwvziakjwf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydWRtdmdzZGdsd3Z6aWFrandmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1Njg5NTIsImV4cCI6MjA3NDE0NDk1Mn0.y2ocjcbyDOtCDWmtYO_tP86LzSrrRhr9C5XjseDSfRQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
