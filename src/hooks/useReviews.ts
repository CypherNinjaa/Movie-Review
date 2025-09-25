import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ReviewsService } from "../lib/reviewsService";
import { useAuth } from "./useAuth";
import type {
	CreateReviewPayload,
	UpdateReviewPayload,
	ReviewFilters,
} from "../types/reviews";

export const useReviews = () => {
	const queryClient = useQueryClient();

	// Get reviews for a specific movie
	const useMovieReviews = (movieId: number, filters?: ReviewFilters) => {
		return useQuery({
			queryKey: ["movie-reviews", movieId, filters],
			queryFn: () => ReviewsService.getMovieReviews(movieId, filters),
			enabled: !!movieId,
		});
	};

	// Get movie review statistics
	const useMovieStats = (movieId: number) => {
		return useQuery({
			queryKey: ["movie-stats", movieId],
			queryFn: () => ReviewsService.getMovieStats(movieId),
			enabled: !!movieId,
		});
	};

	// Get user's review for a specific movie
	const useUserMovieReview = (movieId: number) => {
		const { user } = useAuth();
		return useQuery({
			queryKey: ["user-movie-review", movieId, user?.id],
			queryFn: () => ReviewsService.getUserMovieReview(movieId, user?.id),
			enabled: !!movieId && !!user?.id,
		});
	};

	// Get all reviews by a user
	const useUserReviews = (userId?: string, filters?: ReviewFilters) => {
		return useQuery({
			queryKey: ["user-reviews", userId, filters],
			queryFn: () => ReviewsService.getUserReviews(userId!, filters),
			enabled: !!userId,
		});
	};

	// Get recent reviews
	const useRecentReviews = (limit?: number) => {
		return useQuery({
			queryKey: ["recent-reviews", limit],
			queryFn: () => ReviewsService.getRecentReviews(limit),
		});
	};

	// Create review mutation
	const useCreateReview = () => {
		return useMutation({
			mutationFn: (payload: CreateReviewPayload) =>
				ReviewsService.createReview(payload),
			onSuccess: (_data, variables) => {
				// Invalidate and refetch related queries
				queryClient.invalidateQueries({
					queryKey: ["movie-reviews", variables.movie_id],
				});
				queryClient.invalidateQueries({
					queryKey: ["movie-stats", variables.movie_id],
				});
				queryClient.invalidateQueries({
					queryKey: ["user-movie-review", variables.movie_id],
				});
				queryClient.invalidateQueries({
					queryKey: ["recent-reviews"],
				});
			},
		});
	};

	// Update review mutation
	const useUpdateReview = () => {
		const { user } = useAuth();
		return useMutation({
			mutationFn: ({
				reviewId,
				payload,
			}: {
				reviewId: string;
				payload: UpdateReviewPayload;
				movieId: number;
			}) => ReviewsService.updateReview(reviewId, payload),
			onSuccess: (_data, variables) => {
				// Invalidate and refetch related queries
				queryClient.invalidateQueries({
					queryKey: ["movie-reviews", variables.movieId],
				});
				queryClient.invalidateQueries({
					queryKey: ["movie-stats", variables.movieId],
				});
				queryClient.invalidateQueries({
					queryKey: ["user-movie-review", variables.movieId],
				});
				queryClient.invalidateQueries({
					queryKey: ["user-reviews", user?.id],
				});
				queryClient.invalidateQueries({
					queryKey: ["recent-reviews"],
				});
			},
		});
	};

	// Delete review mutation
	const useDeleteReview = () => {
		const { user } = useAuth();
		return useMutation({
			mutationFn: ({ reviewId }: { reviewId: string; movieId: number }) =>
				ReviewsService.deleteReview(reviewId),
			onSuccess: (_data, variables) => {
				// Invalidate and refetch related queries
				queryClient.invalidateQueries({
					queryKey: ["movie-reviews", variables.movieId],
				});
				queryClient.invalidateQueries({
					queryKey: ["movie-stats", variables.movieId],
				});
				queryClient.invalidateQueries({
					queryKey: ["user-movie-review", variables.movieId],
				});
				queryClient.invalidateQueries({
					queryKey: ["user-reviews", user?.id],
				});
				queryClient.invalidateQueries({
					queryKey: ["recent-reviews"],
				});
			},
		});
	};

	return {
		// Queries
		useMovieReviews,
		useMovieStats,
		useUserMovieReview,
		useUserReviews,
		useRecentReviews,

		// Mutations
		useCreateReview,
		useUpdateReview,
		useDeleteReview,
	};
};

// Export individual hooks for convenience
export const useMovieReviews = (movieId: number, filters?: ReviewFilters) => {
	const { useMovieReviews: hook } = useReviews();
	return hook(movieId, filters);
};

export const useMovieStats = (movieId: number) => {
	const { useMovieStats: hook } = useReviews();
	return hook(movieId);
};

export const useUserMovieReview = (movieId: number) => {
	const { useUserMovieReview: hook } = useReviews();
	return hook(movieId);
};

export const useUserReviews = (userId?: string, filters?: ReviewFilters) => {
	const { useUserReviews: hook } = useReviews();
	return hook(userId, filters);
};

export const useRecentReviews = (limit?: number) => {
	const { useRecentReviews: hook } = useReviews();
	return hook(limit);
};

export const useCreateReview = () => {
	const { useCreateReview: hook } = useReviews();
	return hook();
};

export const useUpdateReview = () => {
	const { useUpdateReview: hook } = useReviews();
	return hook();
};

export const useDeleteReview = () => {
	const { useDeleteReview: hook } = useReviews();
	return hook();
};
