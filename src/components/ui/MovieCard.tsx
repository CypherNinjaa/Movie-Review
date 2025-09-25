import { useState, useEffect } from "react";
import type { TMDBMovie } from "../../lib/tmdbClient";
import { tmdbImageBaseUrl } from "../../lib/tmdbClient";
import { useQuickWatchlist } from "../../hooks/useWatchlist";
import "./MovieCard.css";

interface MovieCardProps {
	movie: TMDBMovie;
	onClick?: (movie: TMDBMovie) => void;
}

const formatRating = (rating: number): string => {
	return (rating / 2).toFixed(1); // Convert from 10-point to 5-point scale
};

const formatYear = (dateString: string): string => {
	if (!dateString) return "TBA";
	return new Date(dateString).getFullYear().toString();
};

export const MovieCard = ({ movie, onClick }: MovieCardProps) => {
	const [isInWatchlist, setIsInWatchlist] = useState(false);
	const [isWatchlistLoading, setIsWatchlistLoading] = useState(false);
	const {
		addMovieToWatchlist,
		removeMovieFromWatchlist,
		checkMovieInWatchlist,
		isAuthenticated,
	} = useQuickWatchlist();

	const posterUrl = movie.poster_path
		? `${tmdbImageBaseUrl}${movie.poster_path}`
		: null;

	// Check if movie is in watchlist on mount
	useEffect(() => {
		if (isAuthenticated) {
			checkMovieInWatchlist(movie.id).then(setIsInWatchlist);
		}
	}, [movie.id, isAuthenticated, checkMovieInWatchlist]);

	const handleClick = () => {
		onClick?.(movie);
	};

	const handleWatchlistClick = async (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent card click

		if (!isAuthenticated) return;

		setIsWatchlistLoading(true);
		try {
			if (isInWatchlist) {
				const success = await removeMovieFromWatchlist(movie.id);
				if (success) {
					setIsInWatchlist(false);
				}
			} else {
				const success = await addMovieToWatchlist({
					id: movie.id,
					title: movie.title,
					poster_path: movie.poster_path || undefined,
					release_date: movie.release_date,
					overview: movie.overview,
					genre_ids: movie.genre_ids,
				});
				if (success) {
					setIsInWatchlist(true);
				}
			}
		} catch (error) {
			console.error("Error toggling watchlist:", error);
		} finally {
			setIsWatchlistLoading(false);
		}
	};

	return (
		<article
			className="movie-card"
			onClick={handleClick}
			role="button"
			tabIndex={0}
		>
			<div className="movie-card__poster">
				{posterUrl ? (
					<img
						src={posterUrl}
						alt={`${movie.title} poster`}
						className="movie-card__image"
						loading="lazy"
					/>
				) : (
					<div
						className="movie-card__placeholder"
						aria-label="No poster available"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							className="movie-card__placeholder-icon"
						>
							<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
							<circle cx="8.5" cy="8.5" r="1.5" />
							<polyline points="21,15 16,10 5,21" />
						</svg>
					</div>
				)}
				<div className="movie-card__overlay">
					<div
						className="movie-card__rating"
						aria-label={`Rating: ${formatRating(
							movie.vote_average
						)} out of 5 stars`}
					>
						<svg
							viewBox="0 0 24 24"
							fill="currentColor"
							className="movie-card__star"
						>
							<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
						</svg>
						{formatRating(movie.vote_average)}
					</div>

					{isAuthenticated && (
						<button
							className={`movie-card__watchlist-btn ${
								isInWatchlist ? "active" : ""
							}`}
							onClick={handleWatchlistClick}
							disabled={isWatchlistLoading}
							aria-label={
								isInWatchlist ? "Remove from watchlist" : "Add to watchlist"
							}
							title={
								isInWatchlist ? "Remove from watchlist" : "Add to watchlist"
							}
						>
							{isWatchlistLoading ? (
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									className="movie-card__spinner"
								>
									<path d="M21 12a9 9 0 11-6.219-8.56" />
								</svg>
							) : (
								<svg
									viewBox="0 0 24 24"
									fill={isInWatchlist ? "currentColor" : "none"}
									stroke="currentColor"
									className="movie-card__watchlist-icon"
								>
									<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
								</svg>
							)}
						</button>
					)}
				</div>
			</div>

			<div className="movie-card__content">
				<h3 className="movie-card__title" title={movie.title}>
					{movie.title}
				</h3>
				<p className="movie-card__year">{formatYear(movie.release_date)}</p>
				<p className="movie-card__overview" title={movie.overview}>
					{movie.overview}
				</p>
			</div>
		</article>
	);
};
