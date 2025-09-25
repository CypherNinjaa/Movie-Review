import { forwardRef, type SelectHTMLAttributes } from "react";
import clsx from "clsx";

import "./Select.css";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
	({ className, children, error, ...rest }, ref) => {
		return (
			<div className="select-wrapper">
				<select
					ref={ref}
					className={clsx("select", error && "select--error", className)}
					aria-invalid={Boolean(error)}
					aria-describedby={error ? `${rest.id || rest.name}-error` : undefined}
					{...rest}
				>
					{children}
				</select>
				<span className="select__chevron" aria-hidden="true">
					▾
				</span>
			</div>
		);
	}
);

Select.displayName = "Select";
