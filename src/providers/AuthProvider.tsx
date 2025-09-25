import {
	useCallback,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "../lib/supabaseClient";
import { SupabaseAuthContext, type AuthContextValue } from "./auth-context";

export const SupabaseAuthProvider = ({ children }: { children: ReactNode }) => {
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const initialise = async () => {
			const {
				data: { session: currentSession },
			} = await supabase.auth.getSession();
			setSession(currentSession ?? null);
			setLoading(false);
		};

		const { data: subscription } = supabase.auth.onAuthStateChange(
			(_event, newSession) => {
				setSession(newSession ?? null);
			}
		);

		void initialise();

		return () => {
			subscription?.subscription.unsubscribe();
		};
	}, []);

	const signInWithPassword = useCallback<
		AuthContextValue["signInWithPassword"]
	>(async (payload) => {
		return supabase.auth.signInWithPassword(payload);
	}, []);

	const signOut = useCallback<AuthContextValue["signOut"]>(async () => {
		return supabase.auth.signOut();
	}, []);

	const signUpWithPassword = useCallback<
		AuthContextValue["signUpWithPassword"]
	>(async (payload) => {
		return supabase.auth.signUp({
			email: payload.email,
			password: payload.password,
			options: payload.options,
		});
	}, []);

	const resetPasswordForEmail = useCallback<
		AuthContextValue["resetPasswordForEmail"]
	>(async (payload) => {
		return supabase.auth.resetPasswordForEmail(payload.email, payload.options);
	}, []);

	const updateUserPassword = useCallback<
		AuthContextValue["updateUserPassword"]
	>(async (payload) => {
		return supabase.auth.updateUser({ password: payload.password });
	}, []);

	const updateUserProfile = useCallback<AuthContextValue["updateUserProfile"]>(
		async (payload) => {
			return supabase.auth.updateUser({
				data: {
					display_name: payload.display_name,
					avatar_url: payload.avatar_url,
				},
			});
		},
		[]
	);

	const value = useMemo<AuthContextValue>(
		() => ({
			client: supabase,
			session,
			user: session?.user ?? null,
			loading,
			signInWithPassword,
			signUpWithPassword,
			signOut,
			resetPasswordForEmail,
			updateUserPassword,
			updateUserProfile,
		}),
		[
			loading,
			session,
			signInWithPassword,
			signOut,
			signUpWithPassword,
			resetPasswordForEmail,
			updateUserPassword,
			updateUserProfile,
		]
	);

	return (
		<SupabaseAuthContext.Provider value={value}>
			{children}
		</SupabaseAuthContext.Provider>
	);
};
