import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
	MovieFilters,
	type FilterOptions,
} from "../components/movies/MovieFilters";
import { MovieGrid } from "../components/movies/MovieGrid";
import {
	usePopularMovies,
	useSearchMovies,
	useGenres,
} from "../hooks/useMovies";
import type { TMDBMovie } from "../lib/tmdbClient";

export const DiscoverPage = () => {
	const navigate = useNavigate();
	const [filters, setFilters] = useState<FilterOptions>({
		sortBy: "popularity.desc",
	});

	// Fetch genres for filter dropdown
	const { data: genresData, isLoading: genresLoading } = useGenres();
	const genres = genresData?.genres || [];

	// Use search if there's a search term, otherwise use popular/filtered movies
	const isSearchMode = Boolean(filters.search?.trim());

	const popularQuery = usePopularMovies({
		sortBy: filters.sortBy,
		genre: filters.genre,
		year: filters.year ? parseInt(filters.year) : undefined,
	});

	const searchQuery = useSearchMovies(filters.search || "");

	// Determine which query to use
	const activeQuery = isSearchMode ? searchQuery : popularQuery;

	const {
		data,
		isLoading: queryLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = activeQuery;

	const isLoading = queryLoading || genresLoading;

	// Flatten paginated results
	const movies: TMDBMovie[] = data?.pages.flatMap((page) => page.results) || [];

	const handleFiltersChange = useCallback((newFilters: FilterOptions) => {
		setFilters(newFilters);
	}, []);

	const handleMovieClick = useCallback(
		(movie: TMDBMovie) => {
			navigate(`/movie/${movie.id}`);
		},
		[navigate]
	);

	const handleLoadMore = useCallback(() => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	const getEmptyMessage = () => {
		if (isSearchMode) {
			return `No movies found for "${filters.search}". Try a different search term.`;
		}
		return "No movies found. Try adjusting your filters.";
	};

	return (
		<div className="surface-panel">
			<div className="page__header">
				<h1 className="section-title">Discover Movies</h1>
				<p className="section-subtitle">
					Find your next favorite movie from thousands of titles
				</p>
			</div>

			<div className="page__content">
				<MovieFilters
					genres={genres}
					filters={filters}
					onFiltersChange={handleFiltersChange}
					isLoading={isLoading}
				/>

				<MovieGrid
					movies={movies}
					isLoading={isLoading || isFetchingNextPage}
					hasNextPage={hasNextPage}
					onLoadMore={handleLoadMore}
					onMovieClick={handleMovieClick}
					emptyMessage={getEmptyMessage()}
				/>
			</div>
		</div>
	);
};
