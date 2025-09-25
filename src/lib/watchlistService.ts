// 🎬 Watchlist Service
// Service functions for managing user's movie watchlist

import { supabase } from "./supabaseClient";
import type {
	WatchlistItem,
	WatchlistStats,
	AddToWatchlistRequest,
	AddToWatchlistResponse,
	MarkAsWatchedResponse,
	WatchlistFilters,
} from "../types/watchlist";

export class WatchlistService {
	/**
	 * Get user's watchlist with optional filtering and sorting
	 */
	static async getUserWatchlist(
		userId: string,
		filters: WatchlistFilters = {}
	): Promise<WatchlistItem[]> {
		try {
			let query = supabase.from("watchlist").select("*").eq("user_id", userId);

			// Apply filters
			if (filters.watched !== undefined) {
				query = query.eq("watched", filters.watched);
			}

			if (filters.priority && filters.priority.length > 0) {
				query = query.in("priority", filters.priority);
			}

			if (filters.search) {
				query = query.ilike("movie_title", `%${filters.search}%`);
			}

			// Apply sorting
			const sortBy = filters.sortBy || "added_at";
			const sortOrder = filters.sortOrder || "desc";
			query = query.order(sortBy, { ascending: sortOrder === "asc" });

			const { data, error } = await query;

			if (error) {
				console.error("Error fetching watchlist:", error);
				throw error;
			}

			return data || [];
		} catch (error) {
			console.error("Error in getUserWatchlist:", error);
			throw error;
		}
	}

	/**
	 * Get watchlist statistics for a user
	 */
	static async getUserWatchlistStats(userId: string): Promise<WatchlistStats> {
		try {
			const { data, error } = await supabase.rpc("get_user_watchlist_stats", {
				user_uuid: userId,
			});

			if (error) {
				console.error("Error fetching watchlist stats:", error);
				throw error;
			}

			return (
				data[0] || {
					total_movies: 0,
					unwatched_movies: 0,
					watched_movies: 0,
					high_priority_movies: 0,
					recent_additions: 0,
				}
			);
		} catch (error) {
			console.error("Error in getUserWatchlistStats:", error);
			throw error;
		}
	}

	/**
	 * Add a movie to user's watchlist
	 */
	static async addToWatchlist(
		userId: string,
		movieData: AddToWatchlistRequest
	): Promise<AddToWatchlistResponse> {
		try {
			const { data, error } = await supabase.rpc("add_to_watchlist", {
				p_user_id: userId,
				p_movie_id: movieData.movie_id,
				p_movie_title: movieData.movie_title,
				p_movie_poster_path: movieData.movie_poster_path || null,
				p_movie_release_date: movieData.movie_release_date || null,
				p_movie_overview: movieData.movie_overview || null,
				p_movie_genres: movieData.movie_genres || null,
				p_notes: movieData.notes || null,
				p_priority: movieData.priority || 3,
			});

			if (error) {
				console.error("Error adding to watchlist:", error);
				throw error;
			}

			return data[0];
		} catch (error) {
			console.error("Error in addToWatchlist:", error);
			throw error;
		}
	}

	/**
	 * Remove a movie from user's watchlist
	 */
	static async removeFromWatchlist(
		userId: string,
		movieId: number
	): Promise<boolean> {
		try {
			const { error } = await supabase
				.from("watchlist")
				.delete()
				.eq("user_id", userId)
				.eq("movie_id", movieId);

			if (error) {
				console.error("Error removing from watchlist:", error);
				throw error;
			}

			return true;
		} catch (error) {
			console.error("Error in removeFromWatchlist:", error);
			throw error;
		}
	}

	/**
	 * Mark a movie as watched or unwatched
	 */
	static async markAsWatched(
		userId: string,
		movieId: number,
		watched: boolean = true
	): Promise<MarkAsWatchedResponse> {
		try {
			const { data, error } = await supabase.rpc("mark_as_watched", {
				p_user_id: userId,
				p_movie_id: movieId,
				p_watched: watched,
			});

			if (error) {
				console.error("Error marking as watched:", error);
				throw error;
			}

			return data[0];
		} catch (error) {
			console.error("Error in markAsWatched:", error);
			throw error;
		}
	}

	/**
	 * Update watchlist item (notes, priority, etc.)
	 */
	static async updateWatchlistItem(
		userId: string,
		movieId: number,
		updates: Partial<Pick<WatchlistItem, "notes" | "priority">>
	): Promise<boolean> {
		try {
			const { error } = await supabase
				.from("watchlist")
				.update(updates)
				.eq("user_id", userId)
				.eq("movie_id", movieId);

			if (error) {
				console.error("Error updating watchlist item:", error);
				throw error;
			}

			return true;
		} catch (error) {
			console.error("Error in updateWatchlistItem:", error);
			throw error;
		}
	}

	/**
	 * Check if a movie is in user's watchlist
	 */
	static async isMovieInWatchlist(
		userId: string,
		movieId: number
	): Promise<boolean> {
		try {
			const { data, error } = await supabase
				.from("watchlist")
				.select("id")
				.eq("user_id", userId)
				.eq("movie_id", movieId)
				.maybeSingle();

			if (error) {
				console.error("Error checking watchlist:", error);
				throw error;
			}

			return !!data;
		} catch (error) {
			console.error("Error in isMovieInWatchlist:", error);
			return false;
		}
	}

	/**
	 * Get a specific watchlist item
	 */
	static async getWatchlistItem(
		userId: string,
		movieId: number
	): Promise<WatchlistItem | null> {
		try {
			const { data, error } = await supabase
				.from("watchlist")
				.select("*")
				.eq("user_id", userId)
				.eq("movie_id", movieId)
				.maybeSingle();

			if (error) {
				console.error("Error fetching watchlist item:", error);
				throw error;
			}

			return data || null;
		} catch (error) {
			console.error("Error in getWatchlistItem:", error);
			return null;
		}
	}
}
