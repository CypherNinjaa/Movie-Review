import type { FC } from "react";
import { Card, CardContent, CardHeader } from "../ui/Card";
import { StarRating } from "../ui/StarRating";
import { Button } from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { useDeleteReview } from "../../hooks/useReviews";
import type { ReviewWithUser } from "../../types/reviews";

interface ReviewCardProps {
	review: ReviewWithUser;
	onEdit?: (review: ReviewWithUser) => void;
	showMovieInfo?: boolean;
}

export const ReviewCard: FC<ReviewCardProps> = ({
	review,
	onEdit,
	showMovieInfo = false,
}) => {
	const { user } = useAuth();
	const deleteReview = useDeleteReview();

	const isOwnReview = user?.id === review.user_id;
	const createdDate = new Date(review.created_at).toLocaleDateString();

	const handleDelete = async () => {
		if (!confirm("Are you sure you want to delete this review?")) {
			return;
		}

		try {
			await deleteReview.mutateAsync({
				reviewId: review.id,
				movieId: review.movie_id,
			});
		} catch (error) {
			console.error("Error deleting review:", error);
			// You might want to show a toast notification here
		}
	};

	const handleEdit = () => {
		onEdit?.(review);
	};

	return (
		<Card>
			<CardHeader>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
					}}
				>
					<div style={{ flex: 1 }}>
						{showMovieInfo && (
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: "0.75rem",
									marginBottom: "0.75rem",
								}}
							>
								<img
									src={
										review.movie_poster_path
											? `https://image.tmdb.org/t/p/w92${review.movie_poster_path}`
											: "/placeholder-movie.jpg"
									}
									alt={review.movie_title}
									style={{
										width: "40px",
										height: "60px",
										objectFit: "cover",
										borderRadius: "4px",
									}}
								/>
								<div>
									<h4 style={{ margin: "0 0 0.25rem", fontSize: "0.975rem" }}>
										{review.movie_title}
									</h4>
									{review.movie_release_date && (
										<p
											style={{
												margin: 0,
												fontSize: "0.75rem",
												color: "var(--color-text-muted)",
											}}
										>
											{new Date(review.movie_release_date).getFullYear()}
										</p>
									)}
								</div>
							</div>
						)}

						<div
							style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
						>
							<StarRating value={review.rating} readonly size="small" />
							<div>
								<p
									style={{
										margin: "0 0 0.25rem",
										fontSize: "0.875rem",
										fontWeight: "500",
									}}
								>
									{isOwnReview && user?.user_metadata?.display_name
										? user.user_metadata.display_name
										: review.user?.email?.split("@")[0] || "Anonymous User"}
								</p>
								<p
									style={{
										margin: 0,
										fontSize: "0.75rem",
										color: "var(--color-text-muted)",
									}}
								>
									{createdDate}
								</p>
							</div>
						</div>
					</div>

					{isOwnReview && (
						<div style={{ display: "flex", gap: "0.5rem" }}>
							<Button size="sm" variant="ghost" onClick={handleEdit}>
								Edit
							</Button>
							<Button
								size="sm"
								variant="danger"
								onClick={handleDelete}
								isLoading={deleteReview.isPending}
							>
								Delete
							</Button>
						</div>
					)}
				</div>
			</CardHeader>

			<CardContent>
				{review.is_spoiler && (
					<div
						style={{
							backgroundColor: "var(--color-warning-bg, #fef3c7)",
							color: "var(--color-warning-text, #92400e)",
							padding: "0.5rem 0.75rem",
							borderRadius: "4px",
							marginBottom: "1rem",
							fontSize: "0.875rem",
							fontWeight: "500",
						}}
					>
						⚠️ This review contains spoilers
					</div>
				)}

				{review.review_text && (
					<p style={{ margin: 0, lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
						{review.review_text}
					</p>
				)}

				{!review.review_text && (
					<p
						style={{
							margin: 0,
							fontStyle: "italic",
							color: "var(--color-text-muted)",
						}}
					>
						No written review provided.
					</p>
				)}
			</CardContent>
		</Card>
	);
};
