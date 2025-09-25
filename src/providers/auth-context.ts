import { createContext } from "react";
import type { Session, User } from "@supabase/supabase-js";

import type { TypedSupabaseClient } from "../lib/supabaseClient";

export type SignInPayload = {
	email: string;
	password: string;
};

export type SignUpPayload = SignInPayload & {
	options?: {
		data?: Record<string, unknown>;
		emailRedirectTo?: string;
	};
};

export type ResetPasswordPayload = {
	email: string;
	options?: {
		redirectTo?: string;
	};
};

export type UpdatePasswordPayload = {
	password: string;
};

export type UpdateProfilePayload = {
	display_name?: string;
	avatar_url?: string;
};

export interface AuthContextValue {
	client: TypedSupabaseClient;
	session: Session | null;
	user: User | null;
	loading: boolean;
	signInWithPassword: (
		payload: SignInPayload
	) => ReturnType<TypedSupabaseClient["auth"]["signInWithPassword"]>;
	signUpWithPassword: (
		payload: SignUpPayload
	) => ReturnType<TypedSupabaseClient["auth"]["signUp"]>;
	signOut: () => ReturnType<TypedSupabaseClient["auth"]["signOut"]>;
	resetPasswordForEmail: (
		payload: ResetPasswordPayload
	) => ReturnType<TypedSupabaseClient["auth"]["resetPasswordForEmail"]>;
	updateUserPassword: (
		payload: UpdatePasswordPayload
	) => ReturnType<TypedSupabaseClient["auth"]["updateUser"]>;
	updateUserProfile: (
		payload: UpdateProfilePayload
	) => ReturnType<TypedSupabaseClient["auth"]["updateUser"]>;
}

export const SupabaseAuthContext = createContext<AuthContextValue | undefined>(
	undefined
);
