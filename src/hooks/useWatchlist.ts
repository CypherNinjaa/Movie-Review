// 🎬 useWatchlist Hook
// React hook for managing watchlist state and operations

import { useState, useEffect, useCallback } from "react";
import { WatchlistService } from "../lib/watchlistService";
import { useAuth } from "./useAuth";
import type {
	WatchlistItem,
	WatchlistStats,
	AddToWatchlistRequest,
	WatchlistFilters,
	MovieForWatchlist,
} from "../types/watchlist";

export interface UseWatchlistReturn {
	// State
	watchlist: WatchlistItem[];
	stats: WatchlistStats | null;
	isLoading: boolean;
	error: string | null;

	// Actions
	addToWatchlist: (movieData: AddToWatchlistRequest) => Promise<boolean>;
	removeFromWatchlist: (movieId: number) => Promise<boolean>;
	markAsWatched: (movieId: number, watched?: boolean) => Promise<boolean>;
	updateWatchlistItem: (
		movieId: number,
		updates: Partial<Pick<WatchlistItem, "notes" | "priority">>
	) => Promise<boolean>;
	isMovieInWatchlist: (movieId: number) => boolean;
	getWatchlistItem: (movieId: number) => WatchlistItem | null;

	// Filters and sorting
	setFilters: (filters: WatchlistFilters) => void;
	filters: WatchlistFilters;

	// Refresh data
	refreshWatchlist: () => Promise<void>;
	refreshStats: () => Promise<void>;
}

export function useWatchlist(
	initialFilters: WatchlistFilters = {}
): UseWatchlistReturn {
	const { user } = useAuth();
	const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
	const [stats, setStats] = useState<WatchlistStats | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [filters, setFilters] = useState<WatchlistFilters>(initialFilters);

	// Load watchlist data
	const loadWatchlist = useCallback(async () => {
		if (!user?.id) return;

		setIsLoading(true);
		setError(null);

		try {
			const data = await WatchlistService.getUserWatchlist(user.id, filters);
			setWatchlist(data);
		} catch (err) {
			setError("Failed to load watchlist");
			console.error("Error loading watchlist:", err);
		} finally {
			setIsLoading(false);
		}
	}, [user?.id, filters]);

	// Load stats
	const loadStats = useCallback(async () => {
		if (!user?.id) return;

		try {
			const statsData = await WatchlistService.getUserWatchlistStats(user.id);
			setStats(statsData);
		} catch (err) {
			console.error("Error loading watchlist stats:", err);
		}
	}, [user?.id]);

	// Add movie to watchlist
	const addToWatchlist = useCallback(
		async (movieData: AddToWatchlistRequest): Promise<boolean> => {
			if (!user?.id) {
				setError("User not authenticated");
				return false;
			}

			try {
				const response = await WatchlistService.addToWatchlist(
					user.id,
					movieData
				);

				if (response.success) {
					await loadWatchlist(); // Refresh the list
					await loadStats(); // Refresh stats
					return true;
				} else {
					setError(response.message);
					return false;
				}
			} catch (err) {
				setError("Failed to add movie to watchlist");
				console.error("Error adding to watchlist:", err);
				return false;
			}
		},
		[user?.id, loadWatchlist, loadStats]
	);

	// Remove movie from watchlist
	const removeFromWatchlist = useCallback(
		async (movieId: number): Promise<boolean> => {
			if (!user?.id) {
				setError("User not authenticated");
				return false;
			}

			try {
				const success = await WatchlistService.removeFromWatchlist(
					user.id,
					movieId
				);

				if (success) {
					await loadWatchlist(); // Refresh the list
					await loadStats(); // Refresh stats
					return true;
				} else {
					setError("Failed to remove movie from watchlist");
					return false;
				}
			} catch (err) {
				setError("Failed to remove movie from watchlist");
				console.error("Error removing from watchlist:", err);
				return false;
			}
		},
		[user?.id, loadWatchlist, loadStats]
	);

	// Mark movie as watched/unwatched
	const markAsWatched = useCallback(
		async (movieId: number, watched: boolean = true): Promise<boolean> => {
			if (!user?.id) {
				setError("User not authenticated");
				return false;
			}

			try {
				const response = await WatchlistService.markAsWatched(
					user.id,
					movieId,
					watched
				);

				if (response.success) {
					await loadWatchlist(); // Refresh the list
					await loadStats(); // Refresh stats
					return true;
				} else {
					setError(response.message);
					return false;
				}
			} catch (err) {
				setError("Failed to update watch status");
				console.error("Error marking as watched:", err);
				return false;
			}
		},
		[user?.id, loadWatchlist, loadStats]
	);

	// Update watchlist item
	const updateWatchlistItem = useCallback(
		async (
			movieId: number,
			updates: Partial<Pick<WatchlistItem, "notes" | "priority">>
		): Promise<boolean> => {
			if (!user?.id) {
				setError("User not authenticated");
				return false;
			}

			try {
				const success = await WatchlistService.updateWatchlistItem(
					user.id,
					movieId,
					updates
				);

				if (success) {
					await loadWatchlist(); // Refresh the list
					return true;
				} else {
					setError("Failed to update watchlist item");
					return false;
				}
			} catch (err) {
				setError("Failed to update watchlist item");
				console.error("Error updating watchlist item:", err);
				return false;
			}
		},
		[user?.id, loadWatchlist]
	);

	// Check if movie is in watchlist
	const isMovieInWatchlist = useCallback(
		(movieId: number): boolean => {
			return watchlist.some((item) => item.movie_id === movieId);
		},
		[watchlist]
	);

	// Get specific watchlist item
	const getWatchlistItem = useCallback(
		(movieId: number): WatchlistItem | null => {
			return watchlist.find((item) => item.movie_id === movieId) || null;
		},
		[watchlist]
	);

	// Refresh functions
	const refreshWatchlist = useCallback(() => loadWatchlist(), [loadWatchlist]);
	const refreshStats = useCallback(() => loadStats(), [loadStats]);

	// Load data when user or filters change
	useEffect(() => {
		if (user?.id) {
			loadWatchlist();
		}
	}, [user?.id, loadWatchlist]);

	useEffect(() => {
		if (user?.id) {
			loadStats();
		}
	}, [user?.id, loadStats]);

	return {
		// State
		watchlist,
		stats,
		isLoading,
		error,

		// Actions
		addToWatchlist,
		removeFromWatchlist,
		markAsWatched,
		updateWatchlistItem,
		isMovieInWatchlist,
		getWatchlistItem,

		// Filters
		setFilters,
		filters,

		// Refresh
		refreshWatchlist,
		refreshStats,
	};
}

// Helper hook for quick watchlist operations on movie cards
export function useQuickWatchlist() {
	const { user } = useAuth();

	const addMovieToWatchlist = useCallback(
		async (movie: MovieForWatchlist): Promise<boolean> => {
			if (!user?.id) return false;

			try {
				const response = await WatchlistService.addToWatchlist(user.id, {
					movie_id: movie.id,
					movie_title: movie.title,
					movie_poster_path: movie.poster_path,
					movie_release_date: movie.release_date,
					movie_overview: movie.overview,
					priority: 3, // Default priority
				});

				return response.success;
			} catch (err) {
				console.error("Error adding to watchlist:", err);
				return false;
			}
		},
		[user?.id]
	);

	const removeMovieFromWatchlist = useCallback(
		async (movieId: number): Promise<boolean> => {
			if (!user?.id) return false;

			try {
				return await WatchlistService.removeFromWatchlist(user.id, movieId);
			} catch (err) {
				console.error("Error removing from watchlist:", err);
				return false;
			}
		},
		[user?.id]
	);

	const checkMovieInWatchlist = useCallback(
		async (movieId: number): Promise<boolean> => {
			if (!user?.id) return false;

			try {
				return await WatchlistService.isMovieInWatchlist(user.id, movieId);
			} catch (err) {
				console.error("Error checking watchlist:", err);
				return false;
			}
		},
		[user?.id]
	);

	return {
		addMovieToWatchlist,
		removeMovieFromWatchlist,
		checkMovieInWatchlist,
		isAuthenticated: !!user?.id,
	};
}
