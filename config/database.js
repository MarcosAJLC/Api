import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.supabaseUrl;
const supabaseKey = process.env.ServiceRole;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
