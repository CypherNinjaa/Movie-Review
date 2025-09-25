import { useContext } from "react";

import { SupabaseAuthContext } from "../providers/auth-context";

export const useAuth = () => {
	const context = useContext(SupabaseAuthContext);

	if (!context) {
		throw new Error("useAuth must be used within SupabaseAuthProvider");
	}

	return context;
};
