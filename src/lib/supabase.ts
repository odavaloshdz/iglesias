import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://pvhcemfixzqhbmajmfcd.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2aGNlbWZpeHpxaGJtYWptZmNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NTE0MDksImV4cCI6MjA1NjQyNzQwOX0.d_rlGseOAplcy6Tm0euIBaGO2N1AVTK7jnW2-xEoxwo";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
