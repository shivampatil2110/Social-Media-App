import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.supabase_url || "";
const SUPABASE_KEY = process.env.supabase_key || "";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
