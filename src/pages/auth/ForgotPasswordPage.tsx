import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";

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

export const ForgotPasswordPage = () => {
	const location = useLocation();
	const { resetPasswordForEmail } = useAuth();

	const [email, setEmail] = useState("");
	const [formError, setFormError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Check for message from reset password page (e.g., expired link)
	useEffect(() => {
		const message = location.state?.message;
		if (message) {
			setFormError(message);
			// Clear the state to prevent showing message on refresh
			window.history.replaceState({}, document.title);
		}
	}, [location.state]);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setFormError(null);
		setSuccessMessage(null);

		if (!email) {
			setFormError("Please enter your account email address");
			return;
		}

		try {
			setIsSubmitting(true);
			const { error } = await resetPasswordForEmail({
				email,
				options: {
					redirectTo: `${window.location.origin}/reset-password`,
				},
			});

			if (error) {
				setFormError(error.message);
				return;
			}

			setSuccessMessage(
				"Check your inbox for password reset instructions. The link will expire in 60 minutes."
			);
			setEmail("");
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
					<CardTitle>Reset your password</CardTitle>
					<CardDescription>
						Send a secure password reset link to your email.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit}
						style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
					>
						<div>
							<Label htmlFor="reset-email" requiredMarker>
								Email address
							</Label>
							<Input
								id="reset-email"
								type="email"
								autoComplete="email"
								placeholder="you@example.com"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
							/>
						</div>

						{formError ? (
							<p
								role="alert"
								style={{ color: "var(--color-danger)", margin: 0 }}
							>
								{formError}
							</p>
						) : null}

						{successMessage ? (
							<p
								role="status"
								style={{ color: "var(--color-success)", margin: 0 }}
							>
								{successMessage}
							</p>
						) : null}

						<Button type="submit" isLoading={isSubmitting}>
							Send reset link
						</Button>
					</form>

					<p style={{ marginTop: "1.5rem", color: "var(--color-text-muted)" }}>
						Remembered your password?{" "}
						<Link to="/login" className="app-nav__link">
							Back to sign in
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
};
