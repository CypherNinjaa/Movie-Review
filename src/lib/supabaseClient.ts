import { createClient } from "@supabase/supabase-js";
import type { Session, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	console.warn(
		"Supabase environment variables are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file."
	);
}

export type TypedSupabaseClient = SupabaseClient;
export type { Session };

export const supabase: TypedSupabaseClient = createClient(
	supabaseUrl ?? "",
	supabaseAnonKey ?? "",
	{
		auth: {
			persistSession: true,
			detectSessionInUrl: true,
			autoRefreshToken: true,
		},
	}
);
