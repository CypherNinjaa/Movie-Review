import { Link } from "react-router-dom";

export const NotFoundPage = () => {
	return (
		<div
			className="surface-panel"
			style={{ textAlign: "center", padding: "4rem 2rem" }}
		>
			<p className="section-subtitle">404</p>
			<h1 className="section-title">We lost that reel</h1>
			<p
				className="section-subtitle"
				style={{ maxWidth: "540px", margin: "0 auto 2rem" }}
			>
				The page you&apos;re looking for never made it through editing. Return
				to the home feed to explore the latest cinematic discoveries.
			</p>
			<Link to="/" className="btn btn--primary">
				Go home
			</Link>
		</div>
	);
};
