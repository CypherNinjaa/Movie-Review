// Types for the movie review system

export interface Review {
	id: string;
	user_id: string;
	movie_id: number;
	movie_title: string;
	movie_poster_path: string | null;
	movie_release_date: string | null;
	rating: 1 | 2 | 3 | 4 | 5;
	review_text: string | null;
	is_spoiler: boolean;
	created_at: string;
	updated_at: string;
}

export interface ReviewWithUser extends Review {
	user?: {
		id: string;
		email?: string;
		// Add other user profile fields if needed
	};
}

export interface CreateReviewPayload {
	movie_id: number;
	movie_title: string;
	movie_poster_path?: string | null;
	movie_release_date?: string | null;
	rating: 1 | 2 | 3 | 4 | 5;
	review_text?: string;
	is_spoiler?: boolean;
}

export interface UpdateReviewPayload {
	rating?: 1 | 2 | 3 | 4 | 5;
	review_text?: string;
	is_spoiler?: boolean;
}

export interface MovieReviewStats {
	movie_id: number;
	movie_title: string;
	total_reviews: number;
	average_rating: number;
	five_star_count: number;
	four_star_count: number;
	three_star_count: number;
	two_star_count: number;
	one_star_count: number;
}

export interface ReviewFilters {
	rating?: number;
	spoilers?: boolean;
	sortBy?: "newest" | "oldest" | "highest_rated" | "lowest_rated";
	limit?: number;
	offset?: number;
}
