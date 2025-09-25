import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

import { AppHeader } from "../navigation/AppHeader";

interface AppLayoutProps {
	children?: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
	return (
		<div className="app-shell">
			<AppHeader />
			<main className="app-main">{children ?? <Outlet />}</main>
		</div>
	);
};
