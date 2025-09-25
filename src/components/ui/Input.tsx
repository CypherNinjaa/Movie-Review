import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";

import "./Input.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	error?: string;
	leftIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, type = "text", error, leftIcon, disabled, ...rest }, ref) => {
		return (
			<div className="input-wrapper">
				{leftIcon ? <span className="input__icon">{leftIcon}</span> : null}
				<input
					ref={ref}
					type={type}
					className={clsx(
						"input",
						leftIcon && "input--with-icon",
						error && "input--error",
						disabled && "input--disabled",
						className
					)}
					disabled={disabled}
					aria-invalid={Boolean(error)}
					aria-describedby={error ? `${rest.id || rest.name}-error` : undefined}
					{...rest}
				/>
			</div>
		);
	}
);

Input.displayName = "Input";
