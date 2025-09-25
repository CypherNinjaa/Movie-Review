const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY;
const tmdbApiReadToken = import.meta.env.VITE_TMDB_API_READ_TOKEN;
const tmdbBaseUrl = import.meta.env.VITE_TMDB_BASE_URL;
export const tmdbImageBaseUrl = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
export const tmdbBackdropBaseUrl = import.meta.env.VITE_TMDB_BACKDROP_BASE_URL;

if (!tmdbApiKey || !tmdbApiReadToken || !tmdbBaseUrl) {
	console.warn(
		"TMDB environment variables are missing. Please check your .env file."
	);
}

export interface TMDBMovie {
	id: number;
	title: string;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	release_date: string;
	vote_average: number;
	vote_count: number;
	genre_ids: number[];
	adult: boolean;
	popularity: number;
	original_title: string;
	original_language: string;
}

export interface TMDBMoviesResponse {
	page: number;
	results: TMDBMovie[];
	total_pages: number;
	total_results: number;
}

export interface TMDBGenre {
	id: number;
	name: string;
}

export interface TMDBGenresResponse {
	genres: TMDBGenre[];
}

export interface MovieFilters {
	page?: number;
	genre?: string;
	sortBy?:
		| "popularity.desc"
		| "release_date.desc"
		| "vote_average.desc"
		| "vote_count.desc";
	year?: number;
	includeAdult?: boolean;
}

export type ContentFilterLevel = "strict" | "moderate" | "basic";

export interface ContentFilterConfig {
	level: ContentFilterLevel;
	customRegion?: string;
}

class TMDBClient {
	private baseUrl: string;
	private apiKey: string;
	private readToken: string;
	private contentFilterConfig: ContentFilterConfig;

	// Potentially problematic genre IDs that might contain adult content
	private readonly suspiciousGenres = [
		10749, // Romance (can contain explicit content)
		53, // Thriller (sometimes has adult themes)
		80, // Crime (can be very mature)
	];

	// Keywords that might indicate adult content (case-insensitive)
	private readonly suspiciousKeywords = [
		"erotic",
		"adult",
		"xxx",
		"porn",
		"sex",
		"nude",
		"naked",
		"explicit",
		"seduction",
		"intimate",
        "Tuhog",
		"sensual",
	];

	constructor(filterConfig: ContentFilterConfig = { level: "strict" }) {
		this.baseUrl = tmdbBaseUrl ?? "";
		this.apiKey = tmdbApiKey ?? "";
		this.readToken = tmdbApiReadToken ?? "";
		this.contentFilterConfig = filterConfig;
	}

	/**
	 * Enhanced content filtering that checks multiple criteria based on filter level
	 */
	private isContentSafe(movie: TMDBMovie): boolean {
		// Primary check: adult flag (applies to all levels)
		if (movie.adult === true) {
			return false;
		}

		// For 'basic' filtering, only check adult flag
		if (this.contentFilterConfig.level === "basic") {
			return true;
		}

		// Secondary check: suspicious keywords in title or overview (moderate and strict)
		const titleLower = movie.title.toLowerCase();
		const overviewLower = movie.overview.toLowerCase();

		const hasSuspiciousKeywords = this.suspiciousKeywords.some(
			(keyword) =>
				titleLower.includes(keyword) || overviewLower.includes(keyword)
		);

		if (hasSuspiciousKeywords) {
			return false;
		}

		// Tertiary check: genre and popularity filtering (strict only)
		if (
			this.contentFilterConfig.level === "strict" &&
			movie.genre_ids.length > 0
		) {
			const primaryGenre = movie.genre_ids[0];
			const isRomanceThriller = this.suspiciousGenres.includes(primaryGenre);
			const hasLowVoteCount = movie.vote_count < 100; // Low vote count might indicate niche/adult content

			if (isRomanceThriller && hasLowVoteCount) {
				return false;
			}
		}

		return true;
	}

	private async makeRequest<T>(
		endpoint: string,
		params: Record<string, string | number> = {}
	): Promise<T> {
		const url = new URL(`${this.baseUrl}${endpoint}`);

		// Add API key and default params
		url.searchParams.append("api_key", this.apiKey);
		url.searchParams.append("include_adult", "false"); // Always exclude adult content
		url.searchParams.append("language", "en-US"); // Default to English

		// Add region parameter for better content filtering (optional)
		if (!params.region) {
			const region = this.contentFilterConfig.customRegion || "IN"; // Default to India region for family-friendly content
			url.searchParams.append("region", region);
		}

		// Add custom params
		Object.entries(params).forEach(([key, value]) => {
			url.searchParams.append(key, value.toString());
		});

		// Debug logging (can be removed in production)
		if (import.meta.env.DEV) {
			console.log(
				"TMDB API Request:",
				url.toString().replace(this.apiKey, "***")
			);
		}

		try {
			const response = await fetch(url.toString(), {
				headers: {
					Authorization: `Bearer ${this.readToken}`,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(
					`TMDB API error: ${response.status} ${response.statusText}`
				);
			}

			return await response.json();
		} catch (error) {
			console.error("TMDB API request failed:", error);
			throw error;
		}
	}

	async getPopularMovies(
		filters: MovieFilters = {}
	): Promise<TMDBMoviesResponse> {
		const params: Record<string, string | number> = {
			page: filters.page ?? 1,
			sort_by: filters.sortBy ?? "popularity.desc",
		};

		if (filters.genre) {
			params.with_genres = filters.genre;
		}

		if (filters.year) {
			params.primary_release_year = filters.year;
		}

		const response = await this.makeRequest<TMDBMoviesResponse>(
			"/discover/movie",
			params
		);

		// Enhanced client-side filtering for family-friendly content
		const originalCount = response.results.length;
		const filteredResults = response.results.filter((movie) =>
			this.isContentSafe(movie)
		);

		// Debug logging for content filtering
		if (import.meta.env.DEV && originalCount !== filteredResults.length) {
			console.warn(
				`🔞 Filtered out ${
					originalCount - filteredResults.length
				} inappropriate movies from discover endpoint`
			);
		}

		return {
			...response,
			results: filteredResults,
		};
	}

	async searchMovies(query: string, page = 1): Promise<TMDBMoviesResponse> {
		const response = await this.makeRequest<TMDBMoviesResponse>(
			"/search/movie",
			{
				query,
				page,
			}
		);

		// Enhanced client-side filtering for family-friendly content
		const originalCount = response.results.length;
		const filteredResults = response.results.filter((movie) =>
			this.isContentSafe(movie)
		);

		// Debug logging for content filtering
		if (import.meta.env.DEV && originalCount !== filteredResults.length) {
			console.warn(
				`🔞 Filtered out ${
					originalCount - filteredResults.length
				} inappropriate movies from search endpoint`
			);
		}

		return {
			...response,
			results: filteredResults,
		};
	}

	async getMovieDetails(movieId: number): Promise<TMDBMovie> {
		return this.makeRequest<TMDBMovie>(`/movie/${movieId}`);
	}

	async getGenres(): Promise<TMDBGenresResponse> {
		return this.makeRequest<TMDBGenresResponse>("/genre/movie/list");
	}

	async getTrendingMovies(
		timeWindow: "day" | "week" = "week",
		page = 1
	): Promise<TMDBMoviesResponse> {
		const response = await this.makeRequest<TMDBMoviesResponse>(
			`/trending/movie/${timeWindow}`,
			{ page }
		);

		// Enhanced client-side filtering for family-friendly content
		const originalCount = response.results.length;
		const filteredResults = response.results.filter((movie) =>
			this.isContentSafe(movie)
		);

		// Debug logging for content filtering
		if (import.meta.env.DEV && originalCount !== filteredResults.length) {
			console.warn(
				`🔞 Filtered out ${
					originalCount - filteredResults.length
				} inappropriate movies from trending endpoint`
			);
		}

		return {
			...response,
			results: filteredResults,
		};
	}

	async getNowPlayingMovies(page = 1): Promise<TMDBMoviesResponse> {
		const response = await this.makeRequest<TMDBMoviesResponse>(
			"/movie/now_playing",
			{ page }
		);

		// Enhanced client-side filtering for family-friendly content
		const originalCount = response.results.length;
		const filteredResults = response.results.filter((movie) =>
			this.isContentSafe(movie)
		);

		// Debug logging for content filtering
		if (import.meta.env.DEV && originalCount !== filteredResults.length) {
			console.warn(
				`🔞 Filtered out ${
					originalCount - filteredResults.length
				} inappropriate movies from now_playing endpoint`
			);
		}

		return {
			...response,
			results: filteredResults,
		};
	}

	async getUpcomingMovies(page = 1): Promise<TMDBMoviesResponse> {
		const response = await this.makeRequest<TMDBMoviesResponse>(
			"/movie/upcoming",
			{ page }
		);

		// Enhanced client-side filtering for family-friendly content
		const originalCount = response.results.length;
		const filteredResults = response.results.filter((movie) =>
			this.isContentSafe(movie)
		);

		// Debug logging for content filtering
		if (import.meta.env.DEV && originalCount !== filteredResults.length) {
			console.warn(
				`🔞 Filtered out ${
					originalCount - filteredResults.length
				} inappropriate movies from upcoming endpoint`
			);
		}

		return {
			...response,
			results: filteredResults,
		};
	}

	async getTopRatedMovies(page = 1): Promise<TMDBMoviesResponse> {
		const response = await this.makeRequest<TMDBMoviesResponse>(
			"/movie/top_rated",
			{ page }
		);

		// Enhanced client-side filtering for family-friendly content
		const originalCount = response.results.length;
		const filteredResults = response.results.filter((movie) =>
			this.isContentSafe(movie)
		);

		// Debug logging for content filtering
		if (import.meta.env.DEV && originalCount !== filteredResults.length) {
			console.warn(
				`🔞 Filtered out ${
					originalCount - filteredResults.length
				} inappropriate movies from top_rated endpoint`
			);
		}

		return {
			...response,
			results: filteredResults,
		};
	}
}

// Export with strict filtering for India region by default
export const tmdbClient = new TMDBClient({
	level: "strict",
	customRegion: "IN",
});
