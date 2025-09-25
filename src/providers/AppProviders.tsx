import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { SupabaseAuthProvider } from "./AuthProvider";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 1,
			staleTime: 1000 * 60,
		},
	},
});

export const AppProviders = ({ children }: { children: ReactNode }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<SupabaseAuthProvider>{children}</SupabaseAuthProvider>
		</QueryClientProvider>
	);
};
