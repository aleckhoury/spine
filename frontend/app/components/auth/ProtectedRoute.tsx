import { useProtectedRoute } from "~/hooks/useProtectedRoute";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { loading, isAuthenticated } = useProtectedRoute();

	if (loading) {
		return (
			<div className="flex h-screen items-center justify-center">
				Loading...
			</div>
		);
	}

	console.log("isAuthenticated", isAuthenticated);

	if (!isAuthenticated) {
		return null; // The useProtectedRoute hook will handle the redirect
	}

	return <>{children}</>;
}
