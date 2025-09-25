import { useState } from "react";
import type { FC } from "react";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Select } from "../ui/Select";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";
import { useMovieReviews, useMovieStats } from "../../hooks/useReviews";
import { useAuth } from "../../hooks/useAuth";
import type { TMDBMovie } from "../../lib/tmdbClient";
import type { ReviewFilters, ReviewWithUser } from "../../types/reviews";

interface MovieReviewsProps {
	movie: TMDBMovie;
}

export const MovieReviews: FC<MovieReviewsProps> = ({ movie }) => {
	const { user } = useAuth();
	const [showReviewForm, setShowReviewForm] = useState(false);
	const [filters, setFilters] = useState<ReviewFilters>({
		sortBy: "newest",
		spoilers: undefined,
		rating: undefined,
	});

	const { data: reviewsResponse, isLoading: loadingReviews } = useMovieReviews(
		movie.id,
		filters
	);
	const { data: statsResponse, isLoading: loadingStats } = useMovieStats(
		movie.id
	);

	const reviews = reviewsResponse?.data || [];
	const stats = statsResponse?.data;

	const handleWriteReview = () => {
		setShowReviewForm(true);
	};

	const handleEditReview = (_review: ReviewWithUser) => {
		// For now, editing opens the same form which will detect existing review
		setShowReviewForm(true);
	};

	const handleReviewSuccess = () => {
		setShowReviewForm(false);
	};

	const handleReviewCancel = () => {
		setShowReviewForm(false);
	};

	const handleFilterChange = (
		key: keyof ReviewFilters,
		value: string | boolean | undefined
	) => {
		setFilters((prev) => ({
			...prev,
			[key]: value === "all" ? undefined : value,
		}));
	};

	if (showReviewForm) {
		return (
			<div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
				<ReviewForm
					movie={movie}
					onSuccess={handleReviewSuccess}
					onCancel={handleReviewCancel}
				/>
			</div>
		);
	}

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
			{/* Review Statistics */}
			<Card>
				<CardHeader>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<CardTitle>Reviews</CardTitle>
						{user && <Button onClick={handleWriteReview}>Write Review</Button>}
					</div>
				</CardHeader>
				<CardContent>
					{loadingStats ? (
						<p>Loading statistics...</p>
					) : stats ? (
						<div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: "0.75rem",
								}}
							>
								<span style={{ fontSize: "2rem", fontWeight: "bold" }}>
									{stats.average_rating}
								</span>
								<div>
									<div
										style={{
											fontSize: "0.875rem",
											color: "var(--color-text-muted)",
										}}
									>
										Average Rating
									</div>
									<div
										style={{
											fontSize: "0.75rem",
											color: "var(--color-text-muted)",
										}}
									>
										{stats.total_reviews} review
										{stats.total_reviews !== 1 ? "s" : ""}
									</div>
								</div>
							</div>

							{/* Rating Distribution */}
							<div style={{ flex: 1, maxWidth: "300px" }}>
								{[5, 4, 3, 2, 1].map((rating) => {
									const count = stats[
										`${
											["", "one", "two", "three", "four", "five"][rating]
										}_star_count` as keyof typeof stats
									] as number;
									const percentage =
										stats.total_reviews > 0
											? (count / stats.total_reviews) * 100
											: 0;

									return (
										<div
											key={rating}
											style={{
												display: "flex",
												alignItems: "center",
												gap: "0.5rem",
												fontSize: "0.75rem",
												marginBottom: "0.25rem",
											}}
										>
											<span style={{ width: "1rem" }}>{rating}</span>
											<div
												style={{
													flex: 1,
													height: "0.5rem",
													backgroundColor: "var(--color-border, #e5e7eb)",
													borderRadius: "2px",
													overflow: "hidden",
												}}
											>
												<div
													style={{
														width: `${percentage}%`,
														height: "100%",
														backgroundColor: "var(--color-primary, #3b82f6)",
													}}
												/>
											</div>
											<span style={{ width: "2rem", textAlign: "right" }}>
												{count}
											</span>
										</div>
									);
								})}
							</div>
						</div>
					) : (
						<p style={{ color: "var(--color-text-muted)" }}>
							No reviews yet. Be the first to write one!
						</p>
					)}
				</CardContent>
			</Card>

			{/* Review Filters */}
			{reviews.length > 0 && (
				<Card>
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
									style={{ minWidth: "120px" }}
								>
									<option value="newest">Newest</option>
									<option value="oldest">Oldest</option>
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

							<div
								style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
							>
								<label
									htmlFor="filter-spoilers"
									style={{ fontSize: "0.875rem", fontWeight: "500" }}
								>
									Spoilers:
								</label>
								<Select
									id="filter-spoilers"
									value={
										filters.spoilers === undefined
											? "all"
											: filters.spoilers
											? "yes"
											: "no"
									}
									onChange={(e) => {
										const value = e.target.value;
										handleFilterChange(
											"spoilers",
											value === "all" ? undefined : value === "yes"
										);
									}}
									style={{ minWidth: "100px" }}
								>
									<option value="all">All</option>
									<option value="no">No Spoilers</option>
									<option value="yes">With Spoilers</option>
								</Select>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Reviews List */}
			{loadingReviews ? (
				<Card>
					<CardContent style={{ padding: "2rem", textAlign: "center" }}>
						<p>Loading reviews...</p>
					</CardContent>
				</Card>
			) : reviews.length > 0 ? (
				<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
					{reviews.map((review) => (
						<ReviewCard
							key={review.id}
							review={review}
							onEdit={handleEditReview}
						/>
					))}
				</div>
			) : (
				<Card>
					<CardContent style={{ padding: "2rem", textAlign: "center" }}>
						<p
							style={{ color: "var(--color-text-muted)", marginBottom: "1rem" }}
						>
							No reviews match your current filters.
						</p>
						{user && (
							<Button onClick={handleWriteReview}>
								Write the First Review
							</Button>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
};
