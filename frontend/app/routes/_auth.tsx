import { Outlet } from "react-router";
import { ProtectedRoute } from "~/components/auth/ProtectedRoute";

export default function Component() {
	return (
		<ProtectedRoute>
			<Outlet />
		</ProtectedRoute>
	);
}
