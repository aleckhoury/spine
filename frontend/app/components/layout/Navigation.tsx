import { Link, useLocation } from "react-router";
import { Toaster } from "sonner";
import { useAuth } from "~/hooks/useAuth";
import { cn } from "~/lib/utils";

export function Navigation() {
	const { user } = useAuth();
	const location = useLocation();

	const isActive = (path: string) => location.pathname === path;

	return (
		<nav className="bg-white shadow">
			<Toaster />
			<div className="container mx-auto px-6 py-4">
				<div className="flex justify-between items-center">
					<div className="flex space-x-4">
						<Link
							to="/"
							className={cn(
								"px-3 py-2 rounded-md text-sm font-medium",
								isActive("/")
									? "bg-gray-900 text-white"
									: "text-gray-700 hover:bg-gray-100"
							)}
						>
							Home
						</Link>

						{user && (
							<>
								<Link
									to="/dashboard"
									className={cn(
										"px-3 py-2 rounded-md text-sm font-medium",
										isActive("/dashboard")
											? "bg-gray-900 text-white"
											: "text-gray-700 hover:bg-gray-100"
									)}
								>
									Dashboard
								</Link>
								<Link
									to="/profile"
									className={cn(
										"px-3 py-2 rounded-md text-sm font-medium",
										isActive("/profile")
											? "bg-gray-900 text-white"
											: "text-gray-700 hover:bg-gray-100"
									)}
								>
									Profile
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}
