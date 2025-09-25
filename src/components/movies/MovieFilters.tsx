import { useState } from "react";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import type { TMDBGenre } from "../../lib/tmdbClient";
import "./MovieFilters.css";

export interface FilterOptions {
	genre?: string;
	sortBy:
		| "popularity.desc"
		| "release_date.desc"
		| "vote_average.desc"
		| "vote_count.desc";
	year?: string;
	search?: string;
}

interface MovieFiltersProps {
	genres: TMDBGenre[];
	filters: FilterOptions;
	onFiltersChange: (filters: FilterOptions) => void;
	isLoading?: boolean;
}

const SORT_OPTIONS = [
	{ value: "popularity.desc", label: "Most Popular" },
	{ value: "release_date.desc", label: "Latest Release" },
	{ value: "vote_average.desc", label: "Highest Rated" },
	{ value: "vote_count.desc", label: "Most Voted" },
] as const;

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 30 }, (_, i) => {
	const year = currentYear - i;
	return { value: year.toString(), label: year.toString() };
});

export const MovieFilters = ({
	genres,
	filters,
	onFiltersChange,
	isLoading,
}: MovieFiltersProps) => {
	const [searchInput, setSearchInput] = useState(filters.search || "");

	const handleSearchSubmit = () => {
		onFiltersChange({
			...filters,
			search: searchInput.trim() || undefined,
		});
	};

	const handleSearchClear = () => {
		setSearchInput("");
		onFiltersChange({
			...filters,
			search: undefined,
		});
	};

	const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const genreId = e.target.value;
		onFiltersChange({
			...filters,
			genre: genreId || undefined,
		});
	};

	const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const sortBy = e.target.value as FilterOptions["sortBy"];
		onFiltersChange({
			...filters,
			sortBy,
		});
	};

	const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const year = e.target.value;
		onFiltersChange({
			...filters,
			year: year || undefined,
		});
	};

	const handleReset = () => {
		setSearchInput("");
		onFiltersChange({
			sortBy: "popularity.desc",
		});
	};

	const hasActiveFilters = filters.genre || filters.year || filters.search;

	return (
		<div className="movie-filters">
			<div className="movie-filters__search">
				<div className="movie-filters__search-input">
					<Input
						type="text"
						placeholder="Search movies..."
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleSearchSubmit();
							}
						}}
						disabled={isLoading}
					/>
				</div>
				<div className="movie-filters__search-actions">
					<Button
						onClick={handleSearchSubmit}
						disabled={isLoading || !searchInput.trim()}
						size="sm"
					>
						Search
					</Button>
					{filters.search && (
						<Button
							onClick={handleSearchClear}
							variant="secondary"
							size="sm"
							disabled={isLoading}
						>
							Clear
						</Button>
					)}
				</div>
			</div>

			<div className="movie-filters__controls">
				<div className="movie-filters__row">
					<div className="movie-filters__field">
						<Select
							value={filters.genre || ""}
							onChange={handleGenreChange}
							disabled={isLoading}
							aria-label="Filter by genre"
						>
							<option value="">All Genres</option>
							{genres.map((genre) => (
								<option key={genre.id} value={genre.id.toString()}>
									{genre.name}
								</option>
							))}
						</Select>
					</div>

					<div className="movie-filters__field">
						<Select
							value={filters.year || ""}
							onChange={handleYearChange}
							disabled={isLoading}
							aria-label="Filter by year"
						>
							<option value="">All Years</option>
							{YEAR_OPTIONS.map(({ value, label }) => (
								<option key={value} value={value}>
									{label}
								</option>
							))}
						</Select>
					</div>

					<div className="movie-filters__field">
						<Select
							value={filters.sortBy}
							onChange={handleSortChange}
							disabled={isLoading}
							aria-label="Sort movies by"
						>
							{SORT_OPTIONS.map(({ value, label }) => (
								<option key={value} value={value}>
									{label}
								</option>
							))}
						</Select>
					</div>

					{hasActiveFilters && (
						<div className="movie-filters__reset">
							<Button
								onClick={handleReset}
								variant="secondary"
								size="sm"
								disabled={isLoading}
							>
								Reset Filters
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
