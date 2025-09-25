import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { Spinner } from "../components/ui/Spinner";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
	children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const location = useLocation();
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div
				style={{
					minHeight: "50vh",
					display: "grid",
					placeItems: "center",
				}}
			>
				<Spinner size="lg" />
			</div>
		);
	}

	if (!user) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	return <>{children}</>;
};
