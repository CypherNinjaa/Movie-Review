import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../components/ui/Card";
import { StarRating } from "../components/ui/StarRating";
import { MovieReviews } from "../components/reviews/MovieReviews";
import { useMovieStats } from "../hooks/useReviews";
import { tmdbClient, type TMDBMovie } from "../lib/tmdbClient";
import "./MovieDetailPage.css";

export const MovieDetailPage = () => {
	const { movieId } = useParams<{ movieId: string }>();
	const navigate = useNavigate();
	const [movie, setMovie] = useState<TMDBMovie | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const { data: statsResponse } = useMovieStats(movie?.id || 0);
	const stats = statsResponse?.data;

	useEffect(() => {
		const fetchMovie = async () => {
			if (!movieId) {
				setError("Movie ID not provided");
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				const movieData = await tmdbClient.getMovieDetails(parseInt(movieId));
				setMovie(movieData);
			} catch (err) {
				console.error("Error fetching movie details:", err);
				setError("Failed to load movie details");
			} finally {
				setLoading(false);
			}
		};

		fetchMovie();
	}, [movieId]);

	if (loading) {
		return (
			<div className="surface-panel movie-detail__loading">
				<div className="movie-detail__loading-spinner">
					<svg className="spinner" viewBox="0 0 50 50">
						<circle
							className="spinner__path"
							cx="25"
							cy="25"
							r="20"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
						/>
					</svg>
				</div>
				<p className="movie-detail__loading-text">
					Loading cinematic experience...
				</p>
			</div>
		);
	}

	if (error || !movie) {
		return (
			<div className="surface-panel movie-detail__error">
				<p className="movie-detail__error-text">{error || "Movie not found"}</p>
				<Button onClick={() => navigate("/discover")} variant="primary">
					← Back to Discover
				</Button>
			</div>
		);
	}

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
		<div className="movie-detail">
			{/* Hero Section with Movie Info */}
			<section
				className="movie-hero"
				style={{
					backgroundImage: backdropUrl ? `url(${backdropUrl})` : undefined,
				}}
			>
				<div className="movie-hero__backdrop"></div>
				<div className="movie-hero__gradient"></div>
				<div className="movie-hero__content">
					<div className="movie-hero__poster">
						<img
							src={posterUrl}
							alt={movie.title}
							className="movie-hero__poster-image"
						/>
					</div>

					<div className="movie-hero__info">
						<div className="movie-hero__nav">
							<Button
								variant="ghost"
								onClick={() => navigate("/discover")}
								className="movie-hero__back-btn"
							>
								← Back to Discover
							</Button>
						</div>

						<h1 className="movie-hero__title">{movie.title}</h1>

						{releaseYear && <p className="movie-hero__year">{releaseYear}</p>}

						<div className="movie-hero__ratings">
							<div className="movie-hero__rating-group">
								<div className="movie-hero__rating-item">
									<span className="movie-hero__rating-label">TMDB:</span>
									<span className="movie-hero__rating-value">
										{movie.vote_average.toFixed(1)}/10
									</span>
									<span className="movie-hero__rating-count">
										({movie.vote_count.toLocaleString()} votes)
									</span>
								</div>

								{stats && (
									<div className="movie-hero__rating-item">
										<span className="movie-hero__rating-label">Users:</span>
										<StarRating
											value={stats.average_rating}
											readonly
											size="small"
										/>
										<span className="movie-hero__rating-value">
											{stats.average_rating}/5
										</span>
										<span className="movie-hero__rating-count">
											({stats.total_reviews} review
											{stats.total_reviews !== 1 ? "s" : ""})
										</span>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Cinematic Overview Section */}
			{movie.overview && (
				<section className="movie-overview">
					<Card>
						<CardHeader>
							<CardTitle className="movie-overview__title">
								<svg
									className="movie-overview__icon"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
								Overview
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="movie-overview__text">{movie.overview}</p>
						</CardContent>
					</Card>
				</section>
			)}

			{/* Cinematic Reviews Section */}
			<section className="movie-reviews-section">
				<MovieReviews movie={movie} />
			</section>
		</div>
	);
};
