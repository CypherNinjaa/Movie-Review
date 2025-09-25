// 🎬 Watchlist Types
// TypeScript interfaces for watchlist functionality

export interface WatchlistItem {
	id: string;
	user_id: string;
	movie_id: number;
	movie_title: string;
	movie_poster_path?: string;
	movie_release_date?: string;
	movie_overview?: string;
	movie_genres?: string[];
	added_at: string;
	notes?: string;
	priority: 1 | 2 | 3 | 4 | 5; // 1=highest, 5=lowest
	watched: boolean;
	watched_at?: string;
}

export interface WatchlistStats {
	total_movies: number;
	unwatched_movies: number;
	watched_movies: number;
	high_priority_movies: number;
	recent_additions: number;
}

export interface AddToWatchlistRequest {
	movie_id: number;
	movie_title: string;
	movie_poster_path?: string;
	movie_release_date?: string;
	movie_overview?: string;
	movie_genres?: string[];
	notes?: string;
	priority?: 1 | 2 | 3 | 4 | 5;
}

export interface AddToWatchlistResponse {
	success: boolean;
	message: string;
	watchlist_id?: string;
}

export interface MarkAsWatchedResponse {
	success: boolean;
	message: string;
}

export interface WatchlistFilters {
	watched?: boolean;
	priority?: number[];
	search?: string;
	sortBy?: "added_at" | "movie_title" | "priority" | "movie_release_date";
	sortOrder?: "asc" | "desc";
}

// For movie data from TMDB
export interface MovieForWatchlist {
	id: number;
	title: string;
	poster_path?: string;
	release_date?: string;
	overview?: string;
	genre_ids?: number[];
}
