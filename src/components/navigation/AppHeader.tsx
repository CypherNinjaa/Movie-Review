import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import clsx from "clsx";

import { useAuth } from "../../hooks/useAuth";
import { Spinner } from "../ui/Spinner";

export const AppHeader = () => {
	const { user, loading } = useAuth();
	const location = useLocation();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	useEffect(() => {
		setIsSidebarOpen(false);
	}, [location.pathname]);

	useEffect(() => {
		if (isSidebarOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [isSidebarOpen]);

	return (
		<>
			<header className="app-header">
				<div className="app-header__inner">
					<NavLink to="/" className="app-brand" aria-label="Movie Oracle home">
						<span className="app-brand__accent">MO</span>
						<span className="app-brand__text">Movie Oracle</span>
					</NavLink>

					<nav
						className="app-nav app-nav--desktop"
						aria-label="Primary navigation"
					>
						<NavLink
							to="/"
							className={({ isActive }) =>
								isActive
									? "app-nav__link app-nav__link--active"
									: "app-nav__link"
							}
						>
							Discover
						</NavLink>
						<NavLink
							to="/reviews"
							className={({ isActive }) =>
								isActive
									? "app-nav__link app-nav__link--active"
									: "app-nav__link"
							}
						>
							My Reviews
						</NavLink>
						<NavLink
							to="/watchlist"
							className={({ isActive }) =>
								isActive
									? "app-nav__link app-nav__link--active"
									: "app-nav__link"
							}
						>
							Watchlist
						</NavLink>
					</nav>

					<div className="app-header__actions">
						{loading ? (
							<Spinner size="sm" />
						) : user ? (
							<div className="app-header__user-menu">
								<NavLink
									to="/profile"
									className="app-header__profile-btn"
									title="Profile"
								>
									<img
										src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}&backgroundColor=1a1a2e&textColor=ffffff`}
										alt="Profile"
										className="app-header__avatar"
									/>
								</NavLink>
							</div>
						) : (
							<>
								<NavLink
									to="/login"
									className="btn btn--ghost btn--sm app-header__btn-desktop"
								>
									Sign in
								</NavLink>
								<NavLink to="/signup" className="btn btn--primary btn--sm">
									Create account
								</NavLink>
							</>
						)}

						<button
							type="button"
							className={clsx(
								"mobile-menu-toggle",
								isSidebarOpen && "mobile-menu-toggle--open"
							)}
							onClick={() => setIsSidebarOpen(!isSidebarOpen)}
							aria-expanded={isSidebarOpen}
							aria-label="Toggle navigation menu"
						>
							<span className="mobile-menu-toggle__bar" />
							<span className="mobile-menu-toggle__bar" />
							<span className="mobile-menu-toggle__bar" />
						</button>
					</div>
				</div>
			</header>

			{/* Mobile Sidebar Overlay */}
			<div
				className={clsx(
					"mobile-sidebar-overlay",
					isSidebarOpen && "mobile-sidebar-overlay--open"
				)}
				onClick={() => setIsSidebarOpen(false)}
				aria-hidden="true"
			/>

			{/* Mobile Sidebar */}
			<aside
				className={clsx(
					"mobile-sidebar",
					isSidebarOpen && "mobile-sidebar--open"
				)}
				aria-label="Mobile navigation"
			>
				<div className="mobile-sidebar__header">
					<NavLink to="/" className="app-brand" aria-label="Movie Oracle home">
						<span className="app-brand__accent">MO</span>
						Movie Oracle
					</NavLink>
				</div>

				<nav className="mobile-sidebar__nav" aria-label="Primary navigation">
					<NavLink
						to="/"
						className={({ isActive }) =>
							isActive
								? "mobile-sidebar__link mobile-sidebar__link--active"
								: "mobile-sidebar__link"
						}
					>
						<svg
							className="mobile-sidebar__icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
						>
							<circle cx="11" cy="11" r="8" />
							<path d="M21 21l-4.35-4.35" />
						</svg>
						Discover
					</NavLink>
					<NavLink
						to="/reviews"
						className={({ isActive }) =>
							isActive
								? "mobile-sidebar__link mobile-sidebar__link--active"
								: "mobile-sidebar__link"
						}
					>
						<svg
							className="mobile-sidebar__icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
						>
							<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
						</svg>
						My Reviews
					</NavLink>
					<NavLink
						to="/watchlist"
						className={({ isActive }) =>
							isActive
								? "mobile-sidebar__link mobile-sidebar__link--active"
								: "mobile-sidebar__link"
						}
					>
						<svg
							className="mobile-sidebar__icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
						>
							<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
						</svg>
						Watchlist
					</NavLink>
				</nav>

				<div className="mobile-sidebar__actions">
					{loading ? (
						<div className="mobile-sidebar__spinner">
							<Spinner size="sm" />
						</div>
					) : user ? (
						<div className="mobile-sidebar__user">
							<NavLink
								to="/profile"
								className={({ isActive }) =>
									isActive
										? "mobile-sidebar__link mobile-sidebar__link--active"
										: "mobile-sidebar__link"
								}
							>
								<svg
									className="mobile-sidebar__icon"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
								>
									<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
									<circle cx="12" cy="7" r="4" />
								</svg>
								Profile
							</NavLink>
						</div>
					) : (
						<>
							<NavLink
								to="/login"
								className="btn btn--ghost mobile-sidebar__btn"
							>
								Sign in
							</NavLink>
							<NavLink
								to="/signup"
								className="btn btn--primary mobile-sidebar__btn"
							>
								Create account
							</NavLink>
						</>
					)}
				</div>
			</aside>
		</>
	);
};
