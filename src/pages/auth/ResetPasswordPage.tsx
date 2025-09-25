import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

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

export const ResetPasswordPage = () => {
	const navigate = useNavigate();
	const { updateUserPassword, user, loading } = useAuth();

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [formError, setFormError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Check if user is authenticated via password reset session
	useEffect(() => {
		// Wait for auth to load
		if (loading) return;

		// If no user session, the reset link was invalid or expired
		if (!user) {
			navigate("/forgot-password", {
				replace: true,
				state: {
					message: "Invalid or expired reset link. Please request a new one.",
				},
			});
		}
	}, [user, loading, navigate]);

	const validatePasswords = (): boolean => {
		if (!password) {
			setFormError("Please enter a new password");
			return false;
		}

		if (password.length < 6) {
			setFormError("Password must be at least 6 characters long");
			return false;
		}

		if (password !== confirmPassword) {
			setFormError("Passwords do not match");
			return false;
		}

		return true;
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setFormError(null);

		if (!validatePasswords()) {
			return;
		}

		try {
			setIsSubmitting(true);
			const { error } = await updateUserPassword({ password });

			if (error) {
				setFormError(error.message);
				return;
			}

			// Success - redirect to login with success message
			navigate("/login", {
				replace: true,
				state: {
					message:
						"Password updated successfully! Please sign in with your new password.",
				},
			});
		} catch (error) {
			setFormError("An unexpected error occurred. Please try again.");
			console.error("Password reset error:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Show loading while auth is loading
	if (loading) {
		return (
			<div
				className="surface-panel"
				style={{ maxWidth: "520px", margin: "0 auto" }}
			>
				<Card>
					<CardContent style={{ textAlign: "center", padding: "2rem" }}>
						<p>Validating reset link...</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	// If no user, we'll redirect (handled in useEffect), but show nothing for now
	if (!user) {
		return null;
	}

	return (
		<div
			className="surface-panel"
			style={{ maxWidth: "520px", margin: "0 auto" }}
		>
			<Card>
				<CardHeader>
					<CardTitle>Set new password</CardTitle>
					<CardDescription>
						Choose a strong password for your account.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit}
						style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
					>
						<div>
							<Label htmlFor="new-password" requiredMarker>
								New password
							</Label>
							<Input
								id="new-password"
								type="password"
								autoComplete="new-password"
								placeholder="Enter your new password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								minLength={6}
							/>
						</div>

						<div>
							<Label htmlFor="confirm-password" requiredMarker>
								Confirm new password
							</Label>
							<Input
								id="confirm-password"
								type="password"
								autoComplete="new-password"
								placeholder="Confirm your new password"
								value={confirmPassword}
								onChange={(event) => setConfirmPassword(event.target.value)}
								minLength={6}
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

						<Button type="submit" isLoading={isSubmitting}>
							Update password
						</Button>
					</form>

					<div style={{ marginTop: "1.5rem" }}>
						<p
							style={{ color: "var(--color-text-muted)", marginBottom: "1rem" }}
						>
							Password requirements:
						</p>
						<ul
							style={{
								color: "var(--color-text-muted)",
								fontSize: "0.875rem",
								paddingLeft: "1.25rem",
								margin: 0,
							}}
						>
							<li>At least 6 characters long</li>
							<li>Should contain a mix of letters and numbers</li>
							<li>Avoid using personal information</li>
						</ul>
					</div>

					<p style={{ marginTop: "1.5rem", color: "var(--color-text-muted)" }}>
						Remember your password?{" "}
						<Link to="/login" className="app-nav__link">
							Back to sign in
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
};
