import type { LabelHTMLAttributes } from "react";
import clsx from "clsx";

import "./Label.css";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
	requiredMarker?: boolean;
}

export const Label = ({
	className,
	children,
	requiredMarker = false,
	...rest
}: LabelProps) => {
	return (
		<label className={clsx("label", className)} {...rest}>
			<span className="label__text">
				{children}
				{requiredMarker ? (
					<span className="label__required" aria-hidden="true">
						*
					</span>
				) : null}
			</span>
		</label>
	);
};
