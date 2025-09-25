import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AppLayout } from "../components/layout/AppLayout";
import { HomePage } from "../pages/HomePage";
import { DiscoverPage } from "../pages/DiscoverPage";
import { MovieDetailPage } from "../pages/MovieDetailPage";
import { ReviewsPage } from "../pages/ReviewsPage";
import { WatchlistPage } from "../pages/WatchlistPage";
import { ProfilePage } from "../pages/ProfilePage";
import { SignInPage } from "../pages/auth/SignInPage";
import { SignUpPage } from "../pages/auth/SignUpPage";
import { ForgotPasswordPage } from "../pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "../pages/auth/ResetPasswordPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRoutes = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<AppLayout />}>
					<Route index element={<HomePage />} />
					<Route path="discover" element={<DiscoverPage />} />
					<Route path="movie/:movieId" element={<MovieDetailPage />} />
					<Route
						path="reviews"
						element={
							<ProtectedRoute>
								<ReviewsPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="watchlist"
						element={
							<ProtectedRoute>
								<WatchlistPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile"
						element={
							<ProtectedRoute>
								<ProfilePage />
							</ProtectedRoute>
						}
					/>
				</Route>

				<Route path="/login" element={<SignInPage />} />
				<Route path="/signup" element={<SignUpPage />} />
				<Route path="/forgot-password" element={<ForgotPasswordPage />} />
				<Route path="/reset-password" element={<ResetPasswordPage />} />
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</BrowserRouter>
	);
};
