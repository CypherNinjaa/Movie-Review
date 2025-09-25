import { useState } from "react";
import type { FC } from "react";
import "./StarRating.css";

interface StarRatingProps {
	value: number;
	onChange?: (rating: number) => void;
	readonly?: boolean;
	size?: "small" | "medium" | "large";
	showLabel?: boolean;
}

export const StarRating: FC<StarRatingProps> = ({
	value,
	onChange,
	readonly = false,
	size = "medium",
	showLabel = false,
}) => {
	const [hoverValue, setHoverValue] = useState<number | null>(null);

	const handleClick = (rating: number) => {
		if (!readonly && onChange) {
			onChange(rating);
		}
	};

	const handleMouseEnter = (rating: number) => {
		if (!readonly) {
			setHoverValue(rating);
		}
	};

	const handleMouseLeave = () => {
		if (!readonly) {
			setHoverValue(null);
		}
	};

	const getSizeClass = () => {
		switch (size) {
			case "small":
				return "star-rating--small";
			case "large":
				return "star-rating--large";
			default:
				return "star-rating--medium";
		}
	};

	const getStarClass = (starNumber: number) => {
		const currentValue = hoverValue ?? value;
		const isFilled = starNumber <= currentValue;
		const isClickable = !readonly;

		let className = "star-rating__star";
		if (isFilled) className += " star-rating__star--filled";
		if (isClickable) className += " star-rating__star--clickable";

		return className;
	};

	const getRatingLabel = (rating: number) => {
		switch (rating) {
			case 1:
				return "Poor";
			case 2:
				return "Fair";
			case 3:
				return "Good";
			case 4:
				return "Very Good";
			case 5:
				return "Excellent";
			default:
				return "No rating";
		}
	};

	return (
		<div className={`star-rating ${getSizeClass()}`}>
			<div className="star-rating__stars" role="radiogroup" aria-label="Rating">
				{[1, 2, 3, 4, 5].map((star) => (
					<button
						key={star}
						type="button"
						className={getStarClass(star)}
						onClick={() => handleClick(star)}
						onMouseEnter={() => handleMouseEnter(star)}
						onMouseLeave={handleMouseLeave}
						disabled={readonly}
						aria-label={`${star} star${star > 1 ? "s" : ""}`}
						role="radio"
						aria-checked={star === value}
					>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="currentColor"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
						</svg>
					</button>
				))}
			</div>
			{showLabel && (
				<span className="star-rating__label">
					{getRatingLabel(hoverValue ?? value)}
				</span>
			)}
		</div>
	);
};
