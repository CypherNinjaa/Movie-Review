import { MovieCard } from "../ui/MovieCard";
import { Button } from "../ui/Button";
import type { TMDBMovie } from "../../lib/tmdbClient";
import "./MovieGrid.css";

interface MovieGridProps {
	movies: TMDBMovie[];
	isLoading?: boolean;
	hasNextPage?: boolean;
	onLoadMore?: () => void;
	onMovieClick?: (movie: TMDBMovie) => void;
	emptyMessage?: string;
}

export const MovieGrid = ({
	movies,
	isLoading,
	hasNextPage,
	onLoadMore,
	onMovieClick,
	emptyMessage = "No movies found. Try adjusting your filters.",
}: MovieGridProps) => {
	if (!isLoading && movies.length === 0) {
		return (
			<div className="movie-grid-empty">
				<div className="movie-grid-empty__content">
					<svg
						className="movie-grid-empty__icon"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
					>
						<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
					</svg>
					<h3 className="movie-grid-empty__title">No movies found</h3>
					<p className="movie-grid-empty__message">{emptyMessage}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="movie-grid">
			<div className="movie-grid__container">
				{movies.map((movie) => (
					<MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
				))}

				{/* Loading skeleton cards */}
				{isLoading && (
					<>
						{Array.from({ length: 8 }).map((_, index) => (
							<div key={`skeleton-${index}`} className="movie-card-skeleton">
								<div className="movie-card-skeleton__poster" />
								<div className="movie-card-skeleton__content">
									<div className="movie-card-skeleton__title" />
									<div className="movie-card-skeleton__year" />
									<div className="movie-card-skeleton__overview" />
									<div className="movie-card-skeleton__overview" />
								</div>
							</div>
						))}
					</>
				)}
			</div>

			{/* Load more button */}
			{hasNextPage && !isLoading && (
				<div className="movie-grid__load-more">
					<Button onClick={onLoadMore} size="lg" disabled={isLoading}>
						Load More Movies
					</Button>
				</div>
			)}

			{/* Loading indicator for load more */}
			{isLoading && movies.length > 0 && (
				<div className="movie-grid__loading">
					<div className="movie-grid__loading-spinner">
						<svg className="spinner" viewBox="0 0 50 50">
							<circle
								className="spinner__path"
								cx="25"
								cy="25"
								r="20"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeDasharray="31.416"
								strokeDashoffset="31.416"
							/>
						</svg>
					</div>
					<p className="movie-grid__loading-text">Loading more movies...</p>
				</div>
			)}
		</div>
	);
};
