import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";

import { Spinner } from "./Spinner";
import "./Button.css";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant = "primary",
			size = "md",
			leftIcon,
			rightIcon,
			isLoading = false,
			children,
			disabled,
			...rest
		},
		ref
	) => {
		const isDisabled = disabled || isLoading;

		return (
			<button
				ref={ref}
				className={clsx(
					"btn",
					`btn--${variant}`,
					size !== "md" && `btn--${size}`,
					isLoading && "btn--loading",
					className
				)}
				disabled={isDisabled}
				{...rest}
			>
				{isLoading ? (
					<span className="btn__spinner">
						<Spinner size={size === "lg" ? "lg" : "sm"} />
					</span>
				) : (
					<span className="btn__content">
						{leftIcon}
						{children}
						{rightIcon}
					</span>
				)}
			</button>
		);
	}
);

Button.displayName = "Button";
