import { useState } from "react";
import { ReviewCard } from "../components/reviews/ReviewCard";
import { ReviewForm } from "../components/reviews/ReviewForm";
import { Select } from "../components/ui/Select";
import { Card, CardContent } from "../components/ui/Card";
import { useUserReviews } from "../hooks/useReviews";
import { useAuth } from "../hooks/useAuth";
import type { ReviewFilters, ReviewWithUser } from "../types/reviews";

export const ReviewsPage = () => {
	const { user } = useAuth();
	const [filters, setFilters] = useState<ReviewFilters>({
		sortBy: "newest",
	});
	const [editingReview, setEditingReview] = useState<ReviewWithUser | null>(
		null
	);

	const { data: reviewsResponse, isLoading } = useUserReviews(
		user?.id,
		filters
	);
	const reviews = reviewsResponse?.data || [];

	const handleFilterChange = (key: keyof ReviewFilters, value: string) => {
		setFilters((prev) => ({
			...prev,
			[key]: value === "all" ? undefined : value,
		}));
	};

	const handleEditReview = (review: ReviewWithUser) => {
		setEditingReview(review);
	};

	const handleCancelEdit = () => {
		setEditingReview(null);
	};

	const handleEditSuccess = () => {
		setEditingReview(null);
	};

	if (!user) {
		return (
			<div className="surface-panel">
				<h1 className="section-title">My Reviews</h1>
				<Card>
					<CardContent style={{ padding: "2rem", textAlign: "center" }}>
						<p>Please sign in to view your reviews.</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="surface-panel">
			<h1 className="section-title">My Reviews</h1>
			<p className="section-subtitle">
				Manage your movie reviews and ratings. You can edit or delete any of
				your reviews.
			</p>

			{/* Filter Controls */}
			{reviews.length > 0 && (
				<Card style={{ marginBottom: "1.5rem" }}>
					<CardContent style={{ padding: "1rem" }}>
						<div
							style={{
								display: "flex",
								gap: "1rem",
								alignItems: "center",
								flexWrap: "wrap",
							}}
						>
							<div
								style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
							>
								<label
									htmlFor="sort-by"
									style={{ fontSize: "0.875rem", fontWeight: "500" }}
								>
									Sort by:
								</label>
								<Select
									id="sort-by"
									value={filters.sortBy || "newest"}
									onChange={(e) => handleFilterChange("sortBy", e.target.value)}
									style={{ minWidth: "140px" }}
								>
									<option value="newest">Newest First</option>
									<option value="oldest">Oldest First</option>
									<option value="highest_rated">Highest Rated</option>
									<option value="lowest_rated">Lowest Rated</option>
								</Select>
							</div>

							<div
								style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
							>
								<label
									htmlFor="filter-rating"
									style={{ fontSize: "0.875rem", fontWeight: "500" }}
								>
									Rating:
								</label>
								<Select
									id="filter-rating"
									value={filters.rating || "all"}
									onChange={(e) => handleFilterChange("rating", e.target.value)}
									style={{ minWidth: "100px" }}
								>
									<option value="all">All</option>
									<option value="5">5 Stars</option>
									<option value="4">4 Stars</option>
									<option value="3">3 Stars</option>
									<option value="2">2 Stars</option>
									<option value="1">1 Star</option>
								</Select>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Edit Form */}
			{editingReview && (
				<div style={{ marginBottom: "2rem" }}>
					<ReviewForm
						movie={{
							id: editingReview.movie_id,
							title: editingReview.movie_title,
							overview: "",
							poster_path: editingReview.movie_poster_path,
							backdrop_path: null,
							release_date: editingReview.movie_release_date || "",
							vote_average: 0,
							vote_count: 0,
							genre_ids: [],
							adult: false,
							popularity: 0,
							original_title: editingReview.movie_title,
							original_language: "en",
						}}
						existingReviewData={editingReview}
						onSuccess={handleEditSuccess}
						onCancel={handleCancelEdit}
					/>
				</div>
			)}

			{/* Reviews List */}
			{isLoading ? (
				<Card>
					<CardContent style={{ padding: "2rem", textAlign: "center" }}>
						<p>Loading your reviews...</p>
					</CardContent>
				</Card>
			) : reviews.length > 0 ? (
				<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
					{reviews.map((review) => (
						<ReviewCard
							key={review.id}
							review={review}
							showMovieInfo={true}
							onEdit={handleEditReview}
						/>
					))}
				</div>
			) : (
				<Card>
					<CardContent style={{ padding: "2rem", textAlign: "center" }}>
						<p
							style={{
								color: "var(--color-text-muted)",
								marginBottom: "0.5rem",
							}}
						>
							You haven't written any reviews yet.
						</p>
						<p
							style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}
						>
							Browse movies in the Discover section to start writing reviews!
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
};
