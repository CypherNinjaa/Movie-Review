import { supabase } from "./supabaseClient";
import type { PostgrestError } from "@supabase/supabase-js";
import type {
	Review,
	ReviewWithUser,
	CreateReviewPayload,
	UpdateReviewPayload,
	MovieReviewStats,
	ReviewFilters,
} from "../types/reviews";

export class ReviewsService {
	/**
	 * Get all reviews for a specific movie
	 */
	static async getMovieReviews(
		movieId: number,
		filters: ReviewFilters = {}
	): Promise<{ data: ReviewWithUser[] | null; error: PostgrestError | null }> {
		let query = supabase
			.from("reviews")
			.select(
				`
        *
      `
			)
			.eq("movie_id", movieId);

		// Apply filters
		if (filters.rating) {
			query = query.eq("rating", filters.rating);
		}

		if (filters.spoilers !== undefined) {
			query = query.eq("is_spoiler", filters.spoilers);
		}

		// Apply sorting
		switch (filters.sortBy) {
			case "oldest":
				query = query.order("created_at", { ascending: true });
				break;
			case "highest_rated":
				query = query.order("rating", { ascending: false });
				break;
			case "lowest_rated":
				query = query.order("rating", { ascending: true });
				break;
			case "newest":
			default:
				query = query.order("created_at", { ascending: false });
				break;
		}

		// Apply pagination
		if (filters.limit) {
			query = query.limit(filters.limit);
		}
		if (filters.offset) {
			query = query.range(
				filters.offset,
				filters.offset + (filters.limit || 10) - 1
			);
		}

		return query;
	}

	/**
	 * Get movie review statistics
	 */
	static async getMovieStats(
		movieId: number
	): Promise<{ data: MovieReviewStats | null; error: PostgrestError | null }> {
		try {
			const result = await supabase
				.from("movie_review_stats")
				.select("*")
				.eq("movie_id", movieId)
				.maybeSingle(); // Use maybeSingle instead of single to handle cases where no stats exist

			return result;
		} catch (error) {
			console.error("Get movie stats error:", error);
			return {
				data: null,
				error: error as PostgrestError,
			};
		}
	}

	/**
	 * Get a user's review for a specific movie
	 */
	static async getUserMovieReview(
		movieId: number,
		userId?: string
	): Promise<{ data: Review | null; error: PostgrestError | null }> {
		if (!userId) {
			return {
				data: null,
				error: { message: "User not authenticated" } as PostgrestError,
			};
		}

		try {
			const result = await supabase
				.from("reviews")
				.select("*")
				.eq("movie_id", movieId)
				.eq("user_id", userId)
				.maybeSingle(); // Use maybeSingle instead of single to avoid errors when no record exists

			return result;
		} catch (error) {
			console.error("Get user movie review error:", error);
			return {
				data: null,
				error: error as PostgrestError,
			};
		}
	}

	/**
	 * Get all reviews by a user
	 */
	static async getUserReviews(
		userId: string,
		filters: ReviewFilters = {}
	): Promise<{ data: Review[] | null; error: PostgrestError | null }> {
		let query = supabase.from("reviews").select("*").eq("user_id", userId);

		// Apply sorting
		switch (filters.sortBy) {
			case "oldest":
				query = query.order("created_at", { ascending: true });
				break;
			case "highest_rated":
				query = query.order("rating", { ascending: false });
				break;
			case "lowest_rated":
				query = query.order("rating", { ascending: true });
				break;
			case "newest":
			default:
				query = query.order("created_at", { ascending: false });
				break;
		}

		// Apply pagination
		if (filters.limit) {
			query = query.limit(filters.limit);
		}
		if (filters.offset) {
			query = query.range(
				filters.offset,
				filters.offset + (filters.limit || 10) - 1
			);
		}

		return query;
	}

	/**
	 * Create a new review
	 */
	static async createReview(
		payload: CreateReviewPayload
	): Promise<{ data: Review | null; error: PostgrestError | null }> {
		// Ensure the payload has the required fields and proper types
		const reviewData = {
			movie_id: payload.movie_id,
			movie_title: payload.movie_title,
			movie_poster_path: payload.movie_poster_path || null,
			movie_release_date: payload.movie_release_date || null,
			rating: payload.rating,
			review_text: payload.review_text || null,
			is_spoiler: payload.is_spoiler || false,
		};

		try {
			const result = await supabase
				.from("reviews")
				.insert([reviewData])
				.select()
				.single();

			return result;
		} catch (error) {
			console.error("Create review error:", error);
			return {
				data: null,
				error: error as PostgrestError,
			};
		}
	}

	/**
	 * Update an existing review
	 */
	static async updateReview(
		reviewId: string,
		payload: UpdateReviewPayload
	): Promise<{ data: Review | null; error: PostgrestError | null }> {
		return supabase
			.from("reviews")
			.update(payload)
			.eq("id", reviewId)
			.select()
			.single();
	}

	/**
	 * Delete a review
	 */
	static async deleteReview(
		reviewId: string
	): Promise<{ error: PostgrestError | null }> {
		return supabase.from("reviews").delete().eq("id", reviewId);
	}

	/**
	 * Get recent reviews across all movies (for homepage/dashboard)
	 */
	static async getRecentReviews(
		limit: number = 10
	): Promise<{ data: Review[] | null; error: PostgrestError | null }> {
		return supabase
			.from("reviews")
			.select("*")
			.order("created_at", { ascending: false })
			.limit(limit);
	}
}
