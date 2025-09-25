import { forwardRef, type TextareaHTMLAttributes } from "react";
import clsx from "clsx";

import "./Textarea.css";

export interface TextareaProps
	extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, error, ...rest }, ref) => {
		return (
			<textarea
				ref={ref}
				className={clsx("textarea", error && "textarea--error", className)}
				aria-invalid={Boolean(error)}
				aria-describedby={error ? `${rest.id || rest.name}-error` : undefined}
				{...rest}
			/>
		);
	}
);

Textarea.displayName = "Textarea";
