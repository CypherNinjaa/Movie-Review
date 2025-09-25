import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
	useTrendingMovies,
	usePopularMovies,
	useTopRatedMovies,
} from "../hooks/useMovies";
import { MovieCard } from "../components/ui/MovieCard";
import { Spinner } from "../components/ui/Spinner";
import type { TMDBMovie } from "../lib/tmdbClient";
import "./HomePage.css";

export const HomePage = () => {
	const { user, loading } = useAuth();
	const navigate = useNavigate();
	const [heroMovieIndex, setHeroMovieIndex] = useState(0);
	const [isHeroLoading, setIsHeroLoading] = useState(true);

	// Get trending and popular movies for the homepage
	const { data: trendingMovies, isLoading: trendingLoading } =
		useTrendingMovies("week");
	const { data: popularMoviesData, isLoading: popularLoading } =
		usePopularMovies();
	const { data: topRatedMovies, isLoading: topRatedLoading } =
		useTopRatedMovies();

	// Extract the first page of results from popular movies
	const popularMovies = popularMoviesData?.pages?.[0];

	// Hero rotation
	useEffect(() => {
		if (trendingMovies?.results?.length) {
			setIsHeroLoading(false);
			const interval = setInterval(() => {
				setHeroMovieIndex(
					(prev) => (prev + 1) % Math.min(5, trendingMovies.results.length)
				);
			}, 8000); // Change every 8 seconds

			return () => clearInterval(interval);
		}
	}, [trendingMovies?.results?.length]);

	const heroMovie = trendingMovies?.results?.[heroMovieIndex];

	return (
		<div className="homepage" role="main">
			{/* Hero Section */}
			<section className="hero-section">
				{isHeroLoading ? (
					<div className="hero-loading">
						<Spinner size="lg" />
						<p>Loading cinematic experience...</p>
					</div>
				) : heroMovie ? (
					<div className="hero-content">
						<div
							className="hero-backdrop"
							style={{
								backgroundImage: heroMovie.backdrop_path
									? `url(https://image.tmdb.org/t/p/original${heroMovie.backdrop_path})`
									: "linear-gradient(135deg, var(--void-600), var(--void-800))",
							}}
						>
							<div className="hero-overlay"></div>
						</div>

						<div className="hero-info">
							<div className="hero-badges">
								<span className="hero-badge">Trending Now</span>
								<span className="hero-rating">
									<svg
										className="hero-star"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
									</svg>
									{(heroMovie.vote_average / 2).toFixed(1)}
								</span>
							</div>

							<h1 className="hero-title">{heroMovie.title}</h1>

							<p className="hero-description">
								{heroMovie.overview?.slice(0, 200)}
								{heroMovie.overview?.length > 200 && "..."}
							</p>

							<div className="hero-actions">
								<Link
									to={`/movie/${heroMovie.id}`}
									className="btn btn--primary btn--lg hero-btn"
								>
									<svg
										className="btn-icon"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
									>
										<polygon points="5,3 19,12 5,21" />
									</svg>
									Watch Details
								</Link>

								{user && (
									<Link
										to="/watchlist"
										className="btn btn--secondary btn--lg hero-btn"
									>
										<svg
											className="btn-icon"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
										>
											<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
										</svg>
										Add to Watchlist
									</Link>
								)}
							</div>
						</div>

						{/* Hero Navigation Dots */}
						<div className="hero-dots">
							{Array.from({
								length: Math.min(5, trendingMovies?.results?.length || 0),
							}).map((_, index) => (
								<button
									key={index}
									className={`hero-dot ${
										index === heroMovieIndex ? "active" : ""
									}`}
									onClick={() => setHeroMovieIndex(index)}
									aria-label={`View movie ${index + 1}`}
								/>
							))}
						</div>
					</div>
				) : (
					<div className="hero-fallback">
						<h1 className="hero-title">Discover Cinema</h1>
						<p className="hero-description">
							Explore thousands of movies, create reviews, and build your
							perfect watchlist
						</p>
					</div>
				)}
			</section>

			{/* Quick Access Section */}
			<section className="quick-access">
				<div className="quick-access-content">
					<h2 className="section-title">Start Your Journey</h2>
					<p className="section-subtitle">
						Curated cinema intelligence powered by community insights
					</p>

					<div className="quick-actions">
						<Link to="/discover" className="quick-action">
							<div className="quick-action-icon">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<circle cx="11" cy="11" r="8" />
									<path d="M21 21l-4.35-4.35" />
								</svg>
							</div>
							<div className="quick-action-content">
								<h3>Explore Catalog</h3>
								<p>Browse thousands of movies with intelligent filters</p>
							</div>
						</Link>

						{loading ? (
							<div className="quick-action loading">
								<Spinner size="sm" />
								<span>Loading...</span>
							</div>
						) : user ? (
							<>
								<Link to="/reviews" className="quick-action">
									<div className="quick-action-icon">
										<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
											<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
										</svg>
									</div>
									<div className="quick-action-content">
										<h3>My Reviews</h3>
										<p>View and manage your movie reviews</p>
									</div>
								</Link>

								<Link to="/watchlist" className="quick-action">
									<div className="quick-action-icon">
										<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
											<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
										</svg>
									</div>
									<div className="quick-action-content">
										<h3>My Watchlist</h3>
										<p>Movies saved for later viewing</p>
									</div>
								</Link>
							</>
						) : (
							<Link to="/signup" className="quick-action">
								<div className="quick-action-icon">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
										<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
										<circle cx="9" cy="7" r="4" />
										<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
										<path d="M16 3.13a4 4 0 0 1 0 7.75" />
									</svg>
								</div>
								<div className="quick-action-content">
									<h3>Join Community</h3>
									<p>Create an account to start reviewing</p>
								</div>
							</Link>
						)}
					</div>
				</div>
			</section>

			{/* Trending Movies Section */}
			<section className="movies-section">
				<div className="movies-section-header">
					<h2 className="section-title">Trending This Week</h2>
					<Link to="/discover?category=trending" className="section-link">
						View All
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path d="M5 12h14" />
							<path d="M12 5l7 7-7 7" />
						</svg>
					</Link>
				</div>

				{trendingLoading ? (
					<div className="movies-loading">
						<Spinner />
						<p>Loading trending movies...</p>
					</div>
				) : (
					<div className="movies-grid">
						{trendingMovies?.results?.slice(0, 8).map((movie: TMDBMovie) => (
							<MovieCard
								key={movie.id}
								movie={movie}
								onClick={() => navigate(`/movie/${movie.id}`)}
							/>
						))}
					</div>
				)}
			</section>

			{/* Popular Movies Section */}
			<section className="movies-section">
				<div className="movies-section-header">
					<h2 className="section-title">Popular Now</h2>
					<Link to="/discover?category=popular" className="section-link">
						View All
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path d="M5 12h14" />
							<path d="M12 5l7 7-7 7" />
						</svg>
					</Link>
				</div>

				{popularLoading ? (
					<div className="movies-loading">
						<Spinner />
						<p>Loading popular movies...</p>
					</div>
				) : (
					<div className="movies-grid">
						{popularMovies?.results?.slice(0, 8).map((movie: TMDBMovie) => (
							<MovieCard
								key={movie.id}
								movie={movie}
								onClick={() => navigate(`/movie/${movie.id}`)}
							/>
						))}
					</div>
				)}
			</section>

			{/* Top Rated Movies Section */}
			<section className="movies-section">
				<div className="movies-section-header">
					<h2 className="section-title">Critically Acclaimed</h2>
					<Link to="/discover?category=top_rated" className="section-link">
						View All
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path d="M5 12h14" />
							<path d="M12 5l7 7-7 7" />
						</svg>
					</Link>
				</div>

				{topRatedLoading ? (
					<div className="movies-loading">
						<Spinner />
						<p>Loading top rated movies...</p>
					</div>
				) : (
					<div className="movies-grid">
						{topRatedMovies?.results?.slice(0, 8).map((movie: TMDBMovie) => (
							<MovieCard
								key={movie.id}
								movie={movie}
								onClick={() => navigate(`/movie/${movie.id}`)}
							/>
						))}
					</div>
				)}
			</section>

			{/* Features Section */}
			<section className="features-section">
				<div className="features-content">
					<h2 className="section-title">Why Movie Oracle?</h2>
					<p className="section-subtitle">
						The ultimate destination for movie enthusiasts
					</p>

					<div className="features-grid">
						<div className="feature-card">
							<div className="feature-icon">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<circle cx="11" cy="11" r="8" />
									<path d="M21 21l-4.35-4.35" />
								</svg>
							</div>
							<h3>Intelligent Discovery</h3>
							<p>
								Advanced filters powered by TMDB help you find exactly what
								you're looking for. Filter by genre, year, rating, and more with
								automatic adult content filtering.
							</p>
						</div>

						<div className="feature-card">
							<div className="feature-icon">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
									<circle cx="9" cy="7" r="4" />
									<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
									<path d="M16 3.13a4 4 0 0 1 0 7.75" />
								</svg>
							</div>
							<h3>Community Reviews</h3>
							<p>
								Share detailed reviews and discover what fellow cinephiles
								think. Rate movies, write thoughtful critiques, and build your
								film legacy.
							</p>
						</div>

						<div className="feature-card">
							<div className="feature-icon">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
								</svg>
							</div>
							<h3>Personal Watchlists</h3>
							<p>
								Organize movies you want to watch with priority levels, personal
								notes, and watch status tracking. Never forget a recommendation
								again.
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};
