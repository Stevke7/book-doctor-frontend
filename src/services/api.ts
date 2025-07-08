import axios, { AxiosError, AxiosInstance } from "axios";
import { jwtDecode } from "jwt-decode";

const api: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
	timeout: 10000, // 10 seconds timeout
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			try {
				const decodedToken: { exp: number } = jwtDecode(token);
				const currentTime = Math.floor(Date.now() / 1000);

				if (decodedToken.exp < currentTime) {
					localStorage.removeItem("token");
					localStorage.removeItem("user");
					window.location.href = "/login";
					throw new axios.Cancel("Session expired. Please log in again.");
				}

				config.headers.Authorization = `Bearer ${token}`;
			} catch (error) {
				localStorage.removeItem("token");
				window.location.href = "/login";
				console.error("Invalid token:", error);
				throw new axios.Cancel("Invalid token. Please log in again.");
			}
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		if (error.response?.status === 401) {
			console.warn("Unauthorized access. Logging out...");
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			window.location.href = "/login";
		} else {
			console.error("API ERROR: ", error.response?.data || error.message);
		}
		return Promise.reject(error);
	}
);

export default api;
