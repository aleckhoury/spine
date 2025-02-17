import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./useAuth";

export function useProtectedRoute() {
	const { user, loading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!loading && !user) {
			navigate("/login", { replace: true });
		}
	}, [user, loading, navigate]);

	return { isAuthenticated: !!user, loading };
}
