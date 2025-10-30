import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { authService } from "../services/authService.ts";
import { useAuth } from "../context/AuthContext.tsx";

const Login = () => {
	const navigate = useNavigate();
	const { login, isAuthenticated, user } = useAuth();

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		if (isAuthenticated && user) {
			const dashboardPath =
				user.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard";
			navigate(dashboardPath);
		}
	}, [isAuthenticated, user, navigate]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		try {
			const response = await authService.login(formData);

			if (!response.user || !response.token || !response.user.role) {
				throw new Error("Invalid response from server");
			}
			login(response.token);
		} catch (err) {
			console.error("Login failed", err);
			setError(err instanceof Error ? err.message : "Invalid Credentials");
			return;
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center bg-gray-50">
				<div className="max-w-md w-full space-y-8 p-8 py-2 bg-white rounded-lg shadow">
					<div>
						<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
							Sign in to your account
						</h2>
					</div>
					<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
						{error && <div className="text-red-500 text-center">{error}</div>}
						<div className="rounded-md shadow-sm flex flex-col gap-1">
							<div>
								<input
									name="email"
									type="email"
									required
									className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
									placeholder="Email address"
									value={formData.email}
									onChange={handleChange}
								/>
							</div>
							<div>
								<input
									name="password"
									type="password"
									required
									className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
									placeholder="Password"
									value={formData.password}
									onChange={handleChange}
								/>
							</div>
						</div>

						<div>
							<button
								type="submit"
								disabled={isLoading}
								className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
									isLoading ? "opacity-50 cursor-not-allowed" : ""
								}`}
							>
								{isLoading ? "Signing in..." : "Sign in"}
							</button>
						</div>
					</form>
					<h2 className="flex flex-row gap-2 items-center justify-center">
						Dont have an account?{" "}
						<NavLink
							to="/register"
							className="text-blue-400 cursor-pointer underline"
						>
							Register here
						</NavLink>
					</h2>
				</div>
			</div>
		</>
	);
};

export default Login;
