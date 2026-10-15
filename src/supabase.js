import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mhvphjcreqhfnulflgiy.supabase.co";

const supabaseKey = "sb_publishable_CPulXF1pmXf_7RacRrv1ag_MHuGAxXC";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
