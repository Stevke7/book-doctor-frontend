import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthUser } from "../types/auth.types.ts";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
	user: AuthUser | null;
	login: (token: string) => void;
	logout: () => void;
	isAuthenticated: boolean;
	loading: boolean;
}

interface DecodedToken {
	userId: string;
	email: string;
	name: string;
	role: "doctor" | "patient";
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [loading, setLoading] = useState(true);

	const login = (token: string) => {
		if (!token) {
			throw new Error("No token provided");
		}

		try {
			const decoded = jwtDecode<DecodedToken>(token);
			if (!decoded.userId || !decoded.email || !decoded.role) {
				throw new Error("Invalid token structure");
			}

			if (decoded.role !== "doctor" && decoded.role !== "patient") {
				throw new Error("Invalid user role");
			}

			localStorage.setItem("token", token);

			setUser({
				_id: decoded.userId,
				email: decoded.email,
				name: decoded.name,
				role: decoded.role,
			});

			setIsAuthenticated(true);
		} catch (err) {
			console.error("Login error:", err);
			logout();
			throw new Error(err instanceof Error ? err.message : "Invalid Token");
		}
	};

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			try {
				const decoded = jwtDecode<DecodedToken>(token);
				setUser({
					_id: decoded.userId,
					email: decoded.email,
					name: decoded.name,
					role: decoded.role,
				});
				setIsAuthenticated(true);
			} catch (err) {
				console.error("Token validation error:", err);
				logout();
			}
		}
		setLoading(false);
	}, []);

	const logout = () => {
		localStorage.removeItem("token");
		setUser(null);
		setIsAuthenticated(false);
	};

	return (
		<AuthContext.Provider
			value={{ user, login, logout, isAuthenticated, loading }}
		>
			{children}
		</AuthContext.Provider>
	);
};
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within a AuthProvider");
	}
	return context;
};
