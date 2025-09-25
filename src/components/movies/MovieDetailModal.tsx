import { type FC, useEffect } from "react";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { StarRating } from "../ui/StarRating";
import { MovieReviews } from "../reviews/MovieReviews";
import { useMovieStats } from "../../hooks/useReviews";
import type { TMDBMovie } from "../../lib/tmdbClient";
import "./MovieDetailModal.css";

interface MovieDetailModalProps {
	movie: TMDBMovie;
	isOpen: boolean;
	onClose: () => void;
}

export const MovieDetailModal: FC<MovieDetailModalProps> = ({
	movie,
	isOpen,
	onClose,
}) => {
	const { data: statsResponse } = useMovieStats(movie.id);
	const stats = statsResponse?.data;

	// Handle escape key and backdrop click
	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const handleBackdropClick = (event: React.MouseEvent) => {
		if (event.target === event.currentTarget) {
			onClose();
		}
	};

	const releaseYear = movie.release_date
		? new Date(movie.release_date).getFullYear()
		: null;
	const posterUrl = movie.poster_path
		? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
		: "/placeholder-movie.jpg";
	const backdropUrl = movie.backdrop_path
		? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
		: null;

	return (
		<div className="movie-modal-backdrop" onClick={handleBackdropClick}>
			<div className="movie-modal">
				<div className="movie-modal__content">
					{/* Header with backdrop */}
					<div
						className="movie-modal__header"
						style={{
							backgroundImage: backdropUrl ? `url(${backdropUrl})` : undefined,
						}}
					>
						<div className="movie-modal__header-overlay">
							<Button
								variant="ghost"
								size="icon"
								className="movie-modal__close"
								onClick={onClose}
								aria-label="Close modal"
							>
								✕
							</Button>

							<div className="movie-modal__header-content">
								<img
									src={posterUrl}
									alt={movie.title}
									className="movie-modal__poster"
								/>

								<div className="movie-modal__info">
									<h1 className="movie-modal__title">{movie.title}</h1>
									{releaseYear && (
										<p className="movie-modal__year">{releaseYear}</p>
									)}

									<div className="movie-modal__rating">
										<div className="movie-modal__tmdb-rating">
											<span className="movie-modal__rating-label">TMDB:</span>
											<span className="movie-modal__rating-value">
												{movie.vote_average.toFixed(1)}/10
											</span>
											<span className="movie-modal__vote-count">
												({movie.vote_count.toLocaleString()} votes)
											</span>
										</div>

										{stats && (
											<div className="movie-modal__user-rating">
												<span className="movie-modal__rating-label">
													Users:
												</span>
												<StarRating
													value={stats.average_rating}
													readonly
													size="small"
												/>
												<span className="movie-modal__rating-value">
													{stats.average_rating}/5
												</span>
												<span className="movie-modal__vote-count">
													({stats.total_reviews} review
													{stats.total_reviews !== 1 ? "s" : ""})
												</span>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Overview */}
					<div className="movie-modal__body">
						{movie.overview && (
							<Card>
								<CardHeader>
									<CardTitle>Overview</CardTitle>
								</CardHeader>
								<CardContent>
									<p style={{ lineHeight: "1.6", margin: 0 }}>
										{movie.overview}
									</p>
								</CardContent>
							</Card>
						)}

						{/* Reviews Section */}
						<MovieReviews movie={movie} />
					</div>
				</div>
			</div>
		</div>
	);
};
