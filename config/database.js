import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.DataBaseUrl;
const supabaseKey = process.env.ServiceRole;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
