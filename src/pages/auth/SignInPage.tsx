import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { Button } from "../../components/ui/Button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { useAuth } from "../../hooks/useAuth";

export const SignInPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { signInWithPassword } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [formError, setFormError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Check for success message from password reset
	useEffect(() => {
		const message = location.state?.message;
		if (message) {
			setSuccessMessage(message);
			// Clear the state to prevent showing message on refresh
			window.history.replaceState({}, document.title);
		}
	}, [location.state]);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setFormError(null);

		if (!email || !password) {
			setFormError("Email and password are required");
			return;
		}

		try {
			setIsSubmitting(true);
			const { error } = await signInWithPassword({ email, password });

			if (error) {
				setFormError(error.message);
				return;
			}

			navigate("/");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div
			className="surface-panel"
			style={{ maxWidth: "520px", margin: "0 auto" }}
		>
			<Card>
				<CardHeader>
					<CardTitle>Welcome back</CardTitle>
					<CardDescription>
						Sign in to access personalized recommendations and your reviews.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit}
						style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
					>
						<div>
							<Label htmlFor="email" requiredMarker>
								Email address
							</Label>
							<Input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								placeholder="you@example.com"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
							/>
						</div>

						<div>
							<Label htmlFor="password" requiredMarker>
								Password
							</Label>
							<Input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								placeholder="••••••••"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
							/>
						</div>

						{successMessage ? (
							<p
								role="status"
								style={{ color: "var(--color-success)", margin: "0" }}
							>
								{successMessage}
							</p>
						) : null}

						{formError ? (
							<p
								role="alert"
								style={{ color: "var(--color-danger)", margin: "0" }}
							>
								{formError}
							</p>
						) : null}

						<Button type="submit" isLoading={isSubmitting}>
							Sign in
						</Button>
					</form>

					<div
						style={{
							marginTop: "1.5rem",
							display: "flex",
							justifyContent: "space-between",
							flexWrap: "wrap",
							gap: "0.75rem",
						}}
					>
						<Link to="/forgot-password" className="app-nav__link">
							Forgot password?
						</Link>
						<span style={{ color: "var(--color-text-muted)" }}>
							New here?{" "}
							<Link to="/signup" className="app-nav__link">
								Create an account
							</Link>
						</span>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
