import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

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

export const SignUpPage = () => {
	const { signUpWithPassword } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [formError, setFormError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setFormError(null);
		setSuccessMessage(null);

		if (!email || !password) {
			setFormError("Please provide email and password");
			return;
		}

		if (password !== confirmPassword) {
			setFormError("Passwords do not match");
			return;
		}

		try {
			setIsSubmitting(true);
			const { error } = await signUpWithPassword({
				email,
				password,
				options: {
					emailRedirectTo: `${window.location.origin}/login`,
				},
			});

			if (error) {
				setFormError(error.message);
				return;
			}

			setSuccessMessage(
				"Success! Check your inbox to confirm your account before signing in."
			);
			setEmail("");
			setPassword("");
			setConfirmPassword("");
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
					<CardTitle>Create your account</CardTitle>
					<CardDescription>
						Join Movie Oracle to track reviews and unlock custom watchlists.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit}
						style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
					>
						<div>
							<Label htmlFor="signup-email" requiredMarker>
								Email address
							</Label>
							<Input
								id="signup-email"
								name="email"
								type="email"
								autoComplete="email"
								placeholder="you@example.com"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
							/>
						</div>

						<div>
							<Label htmlFor="signup-password" requiredMarker>
								Password
							</Label>
							<Input
								id="signup-password"
								name="password"
								type="password"
								autoComplete="new-password"
								placeholder="Create a strong password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
							/>
						</div>

						<div>
							<Label htmlFor="confirm-password" requiredMarker>
								Confirm password
							</Label>
							<Input
								id="confirm-password"
								name="confirmPassword"
								type="password"
								autoComplete="new-password"
								placeholder="Re-enter your password"
								value={confirmPassword}
								onChange={(event) => setConfirmPassword(event.target.value)}
							/>
						</div>

						{formError ? (
							<p
								role="alert"
								style={{ color: "var(--color-danger)", margin: "0" }}
							>
								{formError}
							</p>
						) : null}

						{successMessage ? (
							<p
								role="status"
								style={{ color: "var(--color-success)", margin: "0" }}
							>
								{successMessage}
							</p>
						) : null}

						<Button type="submit" isLoading={isSubmitting}>
							Create account
						</Button>
					</form>

					<p style={{ marginTop: "1.5rem", color: "var(--color-text-muted)" }}>
						Already have an account?{" "}
						<Link to="/login" className="app-nav__link">
							Sign in
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
};
