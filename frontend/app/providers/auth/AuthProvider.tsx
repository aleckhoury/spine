import { useCallback, useEffect, useRef, useState } from "react";
import Client, { Local } from "~/client";
import type { AuthUser } from "~/types";
import AuthContext from "./AuthContext";

const client = new Client(Local);

const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes

// /contexts/auth/authProvider.tsx
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [loading, setLoading] = useState(true);
	const refreshTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

	const clearTokens = useCallback((reason?: string) => {
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		if (refreshTimeoutRef.current) {
			clearTimeout(refreshTimeoutRef.current);
		}
	}, []);

	const setTokens = useCallback((accessToken: string, refreshToken: string) => {
		localStorage.setItem("access_token", accessToken);
		localStorage.setItem("refresh_token", refreshToken);
	}, []);

	const refreshTokens = useCallback(async () => {
		try {
			const refreshToken = localStorage.getItem("refresh_token");
			if (!refreshToken) {
				throw new Error("No refresh token");
			}

			const response = await client.auth.refresh({ refreshToken });
			setTokens(response.accessToken, response.refreshToken);

			// Schedule next refresh
			if (refreshTimeoutRef.current) {
				clearTimeout(refreshTimeoutRef.current);
			}
			refreshTimeoutRef.current = setTimeout(
				refreshTokens,
				TOKEN_REFRESH_INTERVAL
			);

			return response.accessToken;
		} catch (error) {
			clearTokens();
			setUser(null);
			throw error;
		}
	}, [clearTokens, setTokens]);

	const verifyToken = useCallback(async (token: string) => {
		try {
			const userData = await client.auth.verify({ token });
			setUser({
				displayName: userData.username,
				email: userData.email,
				uid: userData.id,
			});
			return true;
		} catch (error) {
			return false;
		}
	}, []);

	// Initialize auth state
	useEffect(() => {
		const initAuth = async () => {
			try {
				let accessToken = localStorage.getItem("access_token");
				if (!accessToken) {
					const refreshToken = localStorage.getItem("refresh_token");
					if (refreshToken) {
						accessToken = await refreshTokens();
					}
				}

				if (accessToken) {
					await verifyToken(accessToken);
					// Schedule token refresh
					refreshTimeoutRef.current = setTimeout(
						refreshTokens,
						TOKEN_REFRESH_INTERVAL
					);
				}
			} catch (error) {
				clearTokens();
			} finally {
				setLoading(false);
			}
		};

		initAuth();

		return () => {
			if (refreshTimeoutRef.current) {
				clearTimeout(refreshTimeoutRef.current);
			}
		};
	}, [clearTokens, refreshTokens, verifyToken]);

	const login = async (identifier: string, password: string) => {
		try {
			const response = await client.auth.login({ identifier, password });
			setTokens(response.accessToken, response.refreshToken);
			await verifyToken(response.accessToken);

			// Schedule token refresh
			refreshTimeoutRef.current = setTimeout(
				refreshTokens,
				TOKEN_REFRESH_INTERVAL
			);
			return true;
		} catch (error) {
			console.error("Login failed:", error);
			return false;
		}
	};

	const signup = async (email: string, username: string, password: string) => {
		try {
			const response = await client.auth.signup({ email, username, password });
			setTokens(response.accessToken, response.refreshToken);
			await verifyToken(response.accessToken);

			// Schedule token refresh
			refreshTimeoutRef.current = setTimeout(
				refreshTokens,
				TOKEN_REFRESH_INTERVAL
			);
			return true;
		} catch (error) {
			console.error("Signup failed:", error);
			return false;
		}
	};

	const logout = async () => {
		try {
			const refreshToken = localStorage.getItem("refresh_token");
			if (refreshToken) {
				await client.auth.logout({ refreshToken });
			}
			clearTokens();
			setUser(null);
			return true;
		} catch (error) {
			console.error("Logout failed:", error);
			return false;
		}
	};

	if (loading) {
		return <div>Loading...</div>; // Or your loading component
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				setUser,
				login,
				signup,
				logout,
				isAuthenticated: !!user,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
