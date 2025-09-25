import { useState, useEffect } from "react";
import type { FC, FormEvent } from "react";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Label } from "../ui/Label";
import { Textarea } from "../ui/Textarea";
import { StarRating } from "../ui/StarRating";
import {
	useCreateReview,
	useUpdateReview,
	useUserMovieReview,
} from "../../hooks/useReviews";
import { useAuth } from "../../hooks/useAuth";
import type { TMDBMovie } from "../../lib/tmdbClient";
import type { ReviewWithUser } from "../../types/reviews";

interface ReviewFormProps {
	movie: TMDBMovie;
	onSuccess?: () => void;
	onCancel?: () => void;
	existingReviewData?: ReviewWithUser;
}

export const ReviewForm: FC<ReviewFormProps> = ({
	movie,
	onSuccess,
	onCancel,
	existingReviewData,
}) => {
	const { user } = useAuth();
	const { data: fetchedReview, isLoading: loadingExistingReview } =
		useUserMovieReview(movie.id);
	const createReview = useCreateReview();
	const updateReview = useUpdateReview();

	// Use provided existingReviewData if available, otherwise use fetched review
	const existingReview = existingReviewData
		? { data: existingReviewData }
		: fetchedReview;

	const [rating, setRating] = useState<number>(
		existingReview?.data?.rating || 0
	);
	const [reviewText, setReviewText] = useState<string>(
		existingReview?.data?.review_text || ""
	);
	const [isSpoiler, setIsSpoiler] = useState<boolean>(
		existingReview?.data?.is_spoiler || false
	);
	const [formError, setFormError] = useState<string | null>(null);

	// Update form state when existing review data changes
	useEffect(() => {
		if (existingReview?.data) {
			setRating(existingReview.data.rating);
			setReviewText(existingReview.data.review_text || "");
			setIsSpoiler(existingReview.data.is_spoiler);
		}
	}, [existingReview?.data]);

	const isEditing = !!existingReview?.data;
	const isSubmitting = createReview.isPending || updateReview.isPending;

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setFormError(null);

		if (!user) {
			setFormError("You must be signed in to write a review");
			return;
		}

		if (rating < 1 || rating > 5) {
			setFormError("Please select a rating from 1 to 5 stars");
			return;
		}

		try {
			if (isEditing && existingReview.data) {
				// Update existing review
				const result = await updateReview.mutateAsync({
					reviewId: existingReview.data.id,
					payload: {
						rating: rating as 1 | 2 | 3 | 4 | 5,
						review_text: reviewText.trim() || undefined,
						is_spoiler: isSpoiler,
					},
					movieId: movie.id,
				});

				if (result.error) {
					setFormError(result.error.message);
					return;
				}
			} else {
				// Create new review
				const result = await createReview.mutateAsync({
					movie_id: movie.id,
					movie_title: movie.title,
					movie_poster_path: movie.poster_path,
					movie_release_date: movie.release_date,
					rating: rating as 1 | 2 | 3 | 4 | 5,
					review_text: reviewText.trim() || undefined,
					is_spoiler: isSpoiler,
				});

				if (result.error) {
					setFormError(result.error.message);
					return;
				}
			}

			// Success
			onSuccess?.();
		} catch (error) {
			setFormError("An unexpected error occurred. Please try again.");
			console.error("Review submission error:", error);
		}
	};

	if (loadingExistingReview) {
		return (
			<Card>
				<CardContent style={{ padding: "2rem", textAlign: "center" }}>
					<p>Loading your review...</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					{isEditing ? "Edit Your Review" : "Write a Review"}
				</CardTitle>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "1rem",
						marginTop: "1rem",
					}}
				>
					<img
						src={
							movie.poster_path
								? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
								: "/placeholder-movie.jpg"
						}
						alt={movie.title}
						style={{
							width: "60px",
							height: "90px",
							objectFit: "cover",
							borderRadius: "4px",
						}}
					/>
					<div>
						<h3 style={{ margin: "0 0 0.25rem", fontSize: "1.125rem" }}>
							{movie.title}
						</h3>
						{movie.release_date && (
							<p style={{ margin: 0, color: "var(--color-text-muted)" }}>
								{new Date(movie.release_date).getFullYear()}
							</p>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={handleSubmit}
					style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
				>
					<div>
						<Label htmlFor="rating" requiredMarker>
							Your Rating
						</Label>
						<div style={{ marginTop: "0.5rem" }}>
							<StarRating
								value={rating}
								onChange={setRating}
								size="large"
								showLabel
							/>
						</div>
					</div>

					<div>
						<Label htmlFor="review-text">Review (Optional)</Label>
						<Textarea
							id="review-text"
							placeholder="Share your thoughts about this movie..."
							value={reviewText}
							onChange={(event) => setReviewText(event.target.value)}
							rows={5}
							style={{ marginTop: "0.5rem" }}
						/>
					</div>

					<div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
						<input
							type="checkbox"
							id="spoiler-warning"
							checked={isSpoiler}
							onChange={(event) => setIsSpoiler(event.target.checked)}
							style={{ margin: 0 }}
						/>
						<Label
							htmlFor="spoiler-warning"
							style={{ margin: 0, cursor: "pointer" }}
						>
							This review contains spoilers
						</Label>
					</div>

					{formError && (
						<p
							role="alert"
							style={{
								color: "var(--color-danger)",
								margin: 0,
								fontSize: "0.875rem",
							}}
						>
							{formError}
						</p>
					)}

					<div
						style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}
					>
						{onCancel && (
							<Button type="button" variant="secondary" onClick={onCancel}>
								Cancel
							</Button>
						)}
						<Button
							type="submit"
							isLoading={isSubmitting}
							disabled={rating === 0}
						>
							{isEditing ? "Update Review" : "Submit Review"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};
