import type { HTMLAttributes } from "react";
import clsx from "clsx";

import "./Card.css";

type CardProps = HTMLAttributes<HTMLDivElement>;

type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;

type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

type CardContentProps = HTMLAttributes<HTMLDivElement>;

export const Card = ({ className, children, ...rest }: CardProps) => {
	return (
		<div className={clsx("card", className)} {...rest}>
			{children}
		</div>
	);
};

export const CardHeader = ({
	className,
	children,
	...rest
}: CardHeaderProps) => (
	<div className={clsx("card__header", className)} {...rest}>
		{children}
	</div>
);

export const CardTitle = ({ className, children, ...rest }: CardTitleProps) => (
	<h2 className={clsx("card__title", className)} {...rest}>
		{children}
	</h2>
);

export const CardDescription = ({
	className,
	children,
	...rest
}: CardDescriptionProps) => (
	<p className={clsx("card__description", className)} {...rest}>
		{children}
	</p>
);

export const CardContent = ({
	className,
	children,
	...rest
}: CardContentProps) => (
	<div className={clsx("card__content", className)} {...rest}>
		{children}
	</div>
);
