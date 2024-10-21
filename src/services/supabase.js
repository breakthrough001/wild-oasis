import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://dzivgegryintaokxblbt.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6aXZnZWdyeWludGFva3hibGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgzMTQ3MzMsImV4cCI6MjA0Mzg5MDczM30.eTvpCyF9WulZ8AZ-Qv665ZWmDouTzCaWjPW0R_r2dys";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
