import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useUserReviews } from "../hooks/useReviews";
import { useWatchlist } from "../hooks/useWatchlist";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Spinner } from "../components/ui/Spinner";
import type { ReviewWithUser } from "../types/reviews";
import "./ProfilePage.css";

export const ProfilePage = () => {
	const { user, loading: authLoading, updateUserProfile, signOut } = useAuth();
	const { data: reviewsData, isLoading: reviewsLoading } = useUserReviews(
		user?.id
	);
	const { stats: watchlistStats } = useWatchlist();
	const [isEditing, setIsEditing] = useState(false);
	const [displayName, setDisplayName] = useState("");
	const [isUpdating, setIsUpdating] = useState(false);
	const [updateError, setUpdateError] = useState<string | null>(null);
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	// Update displayName when user data changes
	useEffect(() => {
		if (user?.user_metadata?.display_name) {
			setDisplayName(user.user_metadata.display_name);
		}
	}, [user?.user_metadata?.display_name]);

	if (authLoading) {
		return (
			<div className="profile-page__loading">
				<Spinner size="lg" className="profile-page__loading-spinner" />
				<p className="profile-page__loading-text">Loading profile...</p>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="profile-page__error">
				<h1>Access Denied</h1>
				<p>Please sign in to view your profile.</p>
			</div>
		);
	}

	const userReviews = reviewsData?.data || [];
	const totalReviews = userReviews.length;
	const averageRating =
		totalReviews > 0
			? userReviews.reduce(
					(sum: number, review: ReviewWithUser) => sum + review.rating,
					0
			  ) / totalReviews
			: 0;

	const handleSaveProfile = async () => {
		if (!displayName.trim()) {
			setUpdateError("Display name cannot be empty");
			return;
		}

		setIsUpdating(true);
		setUpdateError(null);

		try {
			const { error } = await updateUserProfile({
				display_name: displayName.trim(),
			});

			if (error) {
				throw error;
			}

			setIsEditing(false);
		} catch (error) {
			console.error("Profile update error:", error);
			setUpdateError(
				error instanceof Error ? error.message : "Failed to update profile"
			);
		} finally {
			setIsUpdating(false);
		}
	};

	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			await signOut();
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			setIsLoggingOut(false);
		}
	};

	return (
		<div className="profile-page">
			<div className="profile-page__container">
				{/* Profile Header */}
				<section className="profile-hero">
					<div className="profile-hero__backdrop">
						<div className="profile-hero__gradient"></div>
					</div>
					<div className="profile-hero__content">
						<div className="profile-hero__avatar">
							<img
								src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}&backgroundColor=1a1a2e&textColor=ffffff`}
								alt="Profile Avatar"
								className="profile-hero__avatar-image"
							/>
							<div className="profile-hero__avatar-overlay">
								<svg
									className="profile-hero__camera-icon"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
							</div>
						</div>

						<div className="profile-hero__info">
							{isEditing ? (
								<div className="profile-hero__edit-form">
									<Input
										value={displayName}
										onChange={(e) => setDisplayName(e.target.value)}
										placeholder="Enter display name"
										className="profile-hero__name-input"
										disabled={isUpdating}
									/>
									{updateError && (
										<p className="profile-hero__error">{updateError}</p>
									)}
									<div className="profile-hero__edit-actions">
										<Button
											variant="primary"
											onClick={handleSaveProfile}
											disabled={isUpdating}
										>
											{isUpdating ? (
												<>
													<Spinner size="sm" />
													Saving...
												</>
											) : (
												"Save"
											)}
										</Button>
										<Button
											variant="ghost"
											onClick={() => {
												setIsEditing(false);
												setUpdateError(null);
												setDisplayName(user?.user_metadata?.display_name || "");
											}}
											disabled={isUpdating}
										>
											Cancel
										</Button>
									</div>
								</div>
							) : (
								<>
									<h1 className="profile-hero__name">
										{displayName ||
											user?.user_metadata?.display_name ||
											"Movie Enthusiast"}
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setIsEditing(true)}
											className="profile-hero__edit-btn"
										>
											<svg
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												className="profile-hero__edit-icon"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
												/>
											</svg>
										</Button>
									</h1>
									<p className="profile-hero__email">{user.email}</p>
									<p className="profile-hero__joined">
										Member since{" "}
										{new Date(user.created_at).toLocaleDateString("en-US", {
											month: "long",
											year: "numeric",
										})}
									</p>
								</>
							)}
						</div>
					</div>
				</section>

				{/* Stats Grid */}
				<section className="profile-stats">
					<Card className="profile-stats__card">
						<CardContent>
							<div className="profile-stats__item">
								<div className="profile-stats__icon profile-stats__icon--reviews">
									<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
									</svg>
								</div>
								<div className="profile-stats__content">
									<div className="profile-stats__number">{totalReviews}</div>
									<div className="profile-stats__label">Reviews Written</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="profile-stats__card">
						<CardContent>
							<div className="profile-stats__item">
								<div className="profile-stats__icon profile-stats__icon--rating">
									<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
										/>
									</svg>
								</div>
								<div className="profile-stats__content">
									<div className="profile-stats__number">
										{averageRating.toFixed(1)}
									</div>
									<div className="profile-stats__label">Average Rating</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="profile-stats__card">
						<CardContent>
							<div className="profile-stats__item">
								<div className="profile-stats__icon profile-stats__icon--watchlist">
									<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
									</svg>
								</div>
								<div className="profile-stats__content">
									<div className="profile-stats__number">
										{watchlistStats?.total_movies || 0}
									</div>
									<div className="profile-stats__label">Watchlist Items</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="profile-stats__card">
						<CardContent>
							<div className="profile-stats__item">
								<div className="profile-stats__icon profile-stats__icon--pending">
									<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<div className="profile-stats__content">
									<div className="profile-stats__number">
										{watchlistStats?.unwatched_movies || 0}
									</div>
									<div className="profile-stats__label">To Watch</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</section>

				{/* Profile Content */}
				<div className="profile-content">
					{/* Recent Reviews */}
					<section className="profile-section">
						<Card>
							<CardHeader>
								<CardTitle className="profile-section__title">
									<svg
										className="profile-section__icon"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
									</svg>
									Recent Reviews
								</CardTitle>
							</CardHeader>
							<CardContent>
								{reviewsLoading ? (
									<div className="profile-section__loading">
										<Spinner size="sm" />
										<p>Loading reviews...</p>
									</div>
								) : userReviews.length > 0 ? (
									<div className="profile-reviews">
										{userReviews.slice(0, 3).map((review) => (
											<div key={review.id} className="profile-review">
												<div className="profile-review__header">
													<h4 className="profile-review__movie">
														{review.movie_title}
													</h4>
													<div className="profile-review__rating">
														{[...Array(5)].map((_, i) => (
															<svg
																key={i}
																className={`profile-review__star ${
																	i < review.rating
																		? "profile-review__star--filled"
																		: ""
																}`}
																fill="currentColor"
																viewBox="0 0 24 24"
															>
																<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
															</svg>
														))}
													</div>
												</div>
												{review.review_text && (
													<p className="profile-review__content">
														{review.review_text}
													</p>
												)}
												<time className="profile-review__date">
													{new Date(review.created_at).toLocaleDateString()}
												</time>
											</div>
										))}
									</div>
								) : (
									<div className="profile-section__empty">
										<svg
											className="profile-section__empty-icon"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<circle cx="12" cy="12" r="10" />
											<path d="M8 14s1.5 2 4 2 4-2 4-2" />
											<line x1="9" y1="9" x2="9.01" y2="9" />
											<line x1="15" y1="9" x2="15.01" y2="9" />
										</svg>
										<p>No reviews yet</p>
										<p className="profile-section__empty-subtitle">
											Start watching movies and sharing your thoughts!
										</p>
									</div>
								)}
							</CardContent>
						</Card>
					</section>

					{/* Account Settings */}
					<section className="profile-section">
						<Card>
							<CardHeader>
								<CardTitle className="profile-section__title">
									<svg
										className="profile-section__icon"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<circle cx="12" cy="12" r="3" />
										<path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
									</svg>
									Account Settings
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="profile-settings">
									<div className="profile-setting">
										<Label>Display Name</Label>
										<div className="profile-setting__content">
											<Input
												value={
													displayName || user?.user_metadata?.display_name || ""
												}
												onChange={(e) => setDisplayName(e.target.value)}
												placeholder="Enter display name"
												disabled={!isEditing}
											/>
											{!isEditing && (
												<Button
													variant="ghost"
													size="sm"
													onClick={() => setIsEditing(true)}
													className="profile-setting__edit-btn"
												>
													Edit
												</Button>
											)}
										</div>
									</div>

									<div className="profile-setting">
										<Label>Email Address</Label>
										<div className="profile-setting__content">
											<Input
												value={user.email || ""}
												disabled
												className="profile-setting__disabled"
											/>
										</div>
									</div>

									<div className="profile-setting">
										<Label>Account Type</Label>
										<div className="profile-setting__content">
											<Input
												value="Free Account"
												disabled
												className="profile-setting__disabled"
											/>
										</div>
									</div>

									<div className="profile-setting profile-setting--danger">
										<Label>Logout</Label>
										<div className="profile-setting__content">
											<p className="profile-setting__description">
												Sign out of your account and return to the login page.
											</p>
											<Button
												variant="danger"
												onClick={handleLogout}
												disabled={isLoggingOut}
												className="profile-setting__logout-btn"
											>
												{isLoggingOut ? (
													<>
														<Spinner size="sm" />
														Signing out...
													</>
												) : (
													<>
														<svg
															className="profile-setting__logout-icon"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
															/>
														</svg>
														Sign Out
													</>
												)}
											</Button>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</section>
				</div>
			</div>
		</div>
	);
};
