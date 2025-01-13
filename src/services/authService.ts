import api from "./api";
import { AxiosError } from "axios";
import {
	LoginCredentials,
	RegisterCredentials,
	AuthResponse,
} from "../types/auth.types.ts";
import { jwtDecode } from "jwt-decode";

const isTokenExpired = (token: string): boolean => {
	try {
		const decodedToken: { exp: number } = jwtDecode(token);
		const currentTime = Math.floor(Date.now() / 1000);
		return decodedToken.exp < currentTime;
	} catch (error) {
		console.error("Failed to decode token:", error);
		return true; // Treat invalid tokens as expired
	}
};

export const authService = {
	login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
		try {
			const { data } = await api.post<AuthResponse>(
				"/users/login",
				credentials
			);

			if (!data || !data.token || !data.user || !data.user.role) {
				throw new Error("Invalid response from server");
			}

			if (isTokenExpired(data.token)) {
				throw new Error("Token is already expired");
			}
			return data;
		} catch (error) {
			if (error instanceof AxiosError) {
				if (error.response?.status === 401) {
					throw new Error("Invalid email or password");
				}
				if (error.response?.status === 404) {
					throw new Error("User Not Found");
				}
				throw new Error(error.response?.data?.message || "Login failed");
			}
			throw new Error("An unexpected error occurred");
		}
	},

	register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
		try {
			const { data } = await api.post<AuthResponse>(
				"/users/register",
				credentials
			);
			if (!data || !data.token || !data.user || !data.user.role) {
				throw new Error("Invalid response from server");
			}
			return data;
		} catch (error) {
			if (error instanceof AxiosError) {
				throw Error(error.response?.data?.message || "Register failed.");
			}
			throw new Error("An unexpected error occurred");
		}
	},

	logout: (): void => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		window.location.href = "/login";
	},
};
