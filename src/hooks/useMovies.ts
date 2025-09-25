import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import type { MovieFilters } from "../lib/tmdbClient";
import { tmdbClient } from "../lib/tmdbClient";

export const usePopularMovies = (filters: MovieFilters = {}) => {
	return useInfiniteQuery({
		queryKey: ["movies", "popular", filters],
		queryFn: ({ pageParam = 1 }) =>
			tmdbClient.getPopularMovies({ ...filters, page: pageParam }),
		getNextPageParam: (lastPage) => {
			if (lastPage.page < lastPage.total_pages && lastPage.page < 500) {
				// TMDB limit
				return lastPage.page + 1;
			}
			return undefined;
		},
		staleTime: 1000 * 60 * 5, // 5 minutes
		refetchOnWindowFocus: false,
		initialPageParam: 1,
	});
};

export const useSearchMovies = (query: string) => {
	return useInfiniteQuery({
		queryKey: ["movies", "search", query],
		queryFn: ({ pageParam = 1 }) => tmdbClient.searchMovies(query, pageParam),
		getNextPageParam: (lastPage) => {
			if (lastPage.page < lastPage.total_pages && lastPage.page < 500) {
				// TMDB limit
				return lastPage.page + 1;
			}
			return undefined;
		},
		enabled: query.length > 0,
		staleTime: 1000 * 60 * 2, // 2 minutes
		refetchOnWindowFocus: false,
		initialPageParam: 1,
	});
};

export const useMovieDetails = (movieId: number) => {
	return useQuery({
		queryKey: ["movie", "details", movieId],
		queryFn: () => tmdbClient.getMovieDetails(movieId),
		enabled: Boolean(movieId),
		staleTime: 1000 * 60 * 10, // 10 minutes
		refetchOnWindowFocus: false,
	});
};

export const useGenres = () => {
	return useQuery({
		queryKey: ["genres"],
		queryFn: () => tmdbClient.getGenres(),
		staleTime: 1000 * 60 * 60, // 1 hour
		refetchOnWindowFocus: false,
	});
};

export const useTrendingMovies = (
	timeWindow: "day" | "week" = "week",
	page = 1
) => {
	return useQuery({
		queryKey: ["movies", "trending", timeWindow, page],
		queryFn: () => tmdbClient.getTrendingMovies(timeWindow, page),
		staleTime: 1000 * 60 * 5, // 5 minutes
		refetchOnWindowFocus: false,
	});
};

export const useNowPlayingMovies = (page = 1) => {
	return useQuery({
		queryKey: ["movies", "nowPlaying", page],
		queryFn: () => tmdbClient.getNowPlayingMovies(page),
		staleTime: 1000 * 60 * 10, // 10 minutes
		refetchOnWindowFocus: false,
	});
};

export const useUpcomingMovies = (page = 1) => {
	return useQuery({
		queryKey: ["movies", "upcoming", page],
		queryFn: () => tmdbClient.getUpcomingMovies(page),
		staleTime: 1000 * 60 * 10, // 10 minutes
		refetchOnWindowFocus: false,
	});
};

export const useTopRatedMovies = (page = 1) => {
	return useQuery({
		queryKey: ["movies", "topRated", page],
		queryFn: () => tmdbClient.getTopRatedMovies(page),
		staleTime: 1000 * 60 * 10, // 10 minutes
		refetchOnWindowFocus: false,
	});
};
