import { useState } from "react";
import { useWatchlist } from "../hooks/useWatchlist";
import { useAuth } from "../hooks/useAuth";
import { MovieCard } from "../components/ui/MovieCard";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

import { Spinner } from "../components/ui/Spinner";
import type { WatchlistFilters, WatchlistItem } from "../types/watchlist";
import "./WatchlistPage.css";

export const WatchlistPage = () => {
	const { user } = useAuth();
	const [editingItem, setEditingItem] = useState<WatchlistItem | null>(null);
	const [editNotes, setEditNotes] = useState("");
	const [editPriority, setEditPriority] = useState<1 | 2 | 3 | 4 | 5>(3);

	const {
		watchlist,
		stats,
		isLoading,
		error,
		markAsWatched,
		updateWatchlistItem,
		removeFromWatchlist,
		setFilters,
		filters,
	} = useWatchlist();

	if (!user) {
		return (
			<div className="surface-panel text-center">
				<h1 className="section-title">Sign In Required</h1>
				<p className="section-subtitle">
					Please sign in to view your watchlist.
				</p>
			</div>
		);
	}

	const handleFilterChange = (newFilters: Partial<WatchlistFilters>) => {
		setFilters({ ...filters, ...newFilters });
	};

	const handleEditItem = (item: WatchlistItem) => {
		setEditingItem(item);
		setEditNotes(item.notes || "");
		setEditPriority(item.priority);
	};

	const handleSaveEdit = async () => {
		if (!editingItem) return;

		const success = await updateWatchlistItem(editingItem.movie_id, {
			notes: editNotes || undefined,
			priority: editPriority,
		});

		if (success) {
			setEditingItem(null);
		}
	};

	const handleCancelEdit = () => {
		setEditingItem(null);
		setEditNotes("");
		setEditPriority(3);
	};

	const handleToggleWatched = async (
		movieId: number,
		currentStatus: boolean
	) => {
		await markAsWatched(movieId, !currentStatus);
	};

	const handleRemoveFromWatchlist = async (movieId: number) => {
		if (
			window.confirm(
				"Are you sure you want to remove this movie from your watchlist?"
			)
		) {
			await removeFromWatchlist(movieId);
		}
	};

	const getPriorityLabel = (priority: number) => {
		const labels = {
			1: "Highest",
			2: "High",
			3: "Medium",
			4: "Low",
			5: "Lowest",
		};
		return labels[priority as keyof typeof labels];
	};

	const getPriorityColor = (priority: number) => {
		const colors = {
			1: "#ef4444", // red
			2: "#f97316", // orange
			3: "#eab308", // yellow
			4: "#22c55e", // green
			5: "#6b7280", // gray
		};
		return colors[priority as keyof typeof colors];
	};

	return (
		<div className="surface-panel">
			<div className="watchlist-header">
				<div>
					<h1 className="section-title">My Watchlist</h1>
					<p className="section-subtitle">Movies you want to watch later</p>
				</div>

				{stats && (
					<div className="watchlist-stats">
						<div className="stat-item">
							<span className="stat-number">{stats.total_movies}</span>
							<span className="stat-label">Total</span>
						</div>
						<div className="stat-item">
							<span className="stat-number">{stats.unwatched_movies}</span>
							<span className="stat-label">To Watch</span>
						</div>
						<div className="stat-item">
							<span className="stat-number">{stats.watched_movies}</span>
							<span className="stat-label">Watched</span>
						</div>
						<div className="stat-item">
							<span className="stat-number">{stats.high_priority_movies}</span>
							<span className="stat-label">High Priority</span>
						</div>
					</div>
				)}
			</div>

			<div className="watchlist-filters">
				<Input
					placeholder="Search movies..."
					value={filters.search || ""}
					onChange={(e) => handleFilterChange({ search: e.target.value })}
					className="watchlist-search"
				/>

				<select
					value={filters.watched?.toString() || "all"}
					onChange={(e) =>
						handleFilterChange({
							watched:
								e.target.value === "all"
									? undefined
									: e.target.value === "true",
						})
					}
					className="select"
				>
					<option value="all">All Movies</option>
					<option value="false">To Watch</option>
					<option value="true">Watched</option>
				</select>

				<select
					value={filters.sortBy || "added_at"}
					onChange={(e) =>
						handleFilterChange({
							sortBy: e.target.value as WatchlistFilters["sortBy"],
						})
					}
					className="select"
				>
					<option value="added_at">Date Added</option>
					<option value="movie_title">Title</option>
					<option value="priority">Priority</option>
					<option value="movie_release_date">Release Date</option>
				</select>

				<select
					value={filters.sortOrder || "desc"}
					onChange={(e) =>
						handleFilterChange({
							sortOrder: e.target.value as "asc" | "desc",
						})
					}
					className="select"
				>
					<option value="desc">Newest First</option>
					<option value="asc">Oldest First</option>
				</select>
			</div>

			{isLoading && (
				<div className="loading-state">
					<Spinner />
					<p>Loading your watchlist...</p>
				</div>
			)}

			{error && (
				<div className="error-state">
					<p>Error: {error}</p>
				</div>
			)}

			{!isLoading && !error && watchlist.length === 0 && (
				<div className="empty-state">
					<div className="empty-icon">🎬</div>
					<h3>Your watchlist is empty</h3>
					<p>Start adding movies you want to watch later!</p>
				</div>
			)}

			{!isLoading && !error && watchlist.length > 0 && (
				<div className="watchlist-grid">
					{watchlist.map((item) => (
						<div key={item.id} className="watchlist-item">
							<MovieCard
								movie={{
									id: item.movie_id,
									title: item.movie_title,
									poster_path: item.movie_poster_path || null,
									backdrop_path: null,
									release_date: item.movie_release_date || "",
									overview: item.movie_overview || "",
									vote_average: 0,
									vote_count: 0,
									adult: false,
									popularity: 0,
									genre_ids: [],
									original_language: "en",
									original_title: item.movie_title,
								}}
							/>

							<div className="watchlist-item-actions">
								<div className="watchlist-item-meta">
									<div
										className="priority-badge"
										style={{ backgroundColor: getPriorityColor(item.priority) }}
									>
										{getPriorityLabel(item.priority)}
									</div>

									<div className="watched-status">
										<input
											type="checkbox"
											checked={item.watched}
											onChange={() =>
												handleToggleWatched(item.movie_id, item.watched)
											}
											id={`watched-${item.id}`}
										/>
										<label htmlFor={`watched-${item.id}`}>Watched</label>
									</div>
								</div>

								{item.notes && <p className="item-notes">{item.notes}</p>}

								<div className="action-buttons">
									<Button
										variant="secondary"
										size="sm"
										onClick={() => handleEditItem(item)}
									>
										Edit
									</Button>
									<Button
										variant="danger"
										size="sm"
										onClick={() => handleRemoveFromWatchlist(item.movie_id)}
									>
										Remove
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{editingItem && (
				<div className="edit-modal-overlay">
					<div className="edit-modal">
						<h3>Edit Movie</h3>
						<p className="edit-movie-title">{editingItem.movie_title}</p>

						<div className="edit-form">
							<div className="form-group">
								<label htmlFor="edit-priority">Priority</label>
								<select
									value={editPriority.toString()}
									onChange={(e) =>
										setEditPriority(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)
									}
									className="select"
								>
									<option value="1">Highest Priority</option>
									<option value="2">High Priority</option>
									<option value="3">Medium Priority</option>
									<option value="4">Low Priority</option>
									<option value="5">Lowest Priority</option>
								</select>
							</div>

							<div className="form-group">
								<label htmlFor="edit-notes">Notes</label>
								<textarea
									id="edit-notes"
									value={editNotes}
									onChange={(e) => setEditNotes(e.target.value)}
									placeholder="Add your thoughts about this movie..."
									rows={4}
								/>
							</div>

							<div className="edit-actions">
								<Button variant="secondary" onClick={handleCancelEdit}>
									Cancel
								</Button>
								<Button onClick={handleSaveEdit}>Save Changes</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
