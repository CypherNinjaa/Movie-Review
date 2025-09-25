import clsx from "clsx";
import type { HTMLAttributes } from "react";

export type SpinnerSize = "sm" | "md" | "lg";

interface SpinnerProps extends HTMLAttributes<SVGElement> {
	size?: SpinnerSize;
}

const sizeMap: Record<SpinnerSize, number> = {
	sm: 16,
	md: 20,
	lg: 28,
};

export const Spinner = ({ size = "md", className, ...rest }: SpinnerProps) => {
	const dimension = sizeMap[size];

	return (
		<svg
			role="progressbar"
			aria-hidden="true"
			viewBox="0 0 50 50"
			width={dimension}
			height={dimension}
			className={clsx("spinner", className)}
			{...rest}
		>
			<circle
				cx="25"
				cy="25"
				r="20"
				fill="none"
				stroke="currentColor"
				strokeOpacity="0.22"
				strokeWidth="6"
			/>
			<path
				fill="currentColor"
				d="M25 5a20 20 0 0 1 18.32 11.57c1.33 2.89-2.22 5.46-4.61 3.46A14 14 0 0 0 25 11z"
			>
				<animateTransform
					attributeName="transform"
					type="rotate"
					from="0 25 25"
					to="360 25 25"
					dur="0.8s"
					repeatCount="indefinite"
				/>
			</path>
		</svg>
	);
};
