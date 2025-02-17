import { useAuth } from "~/hooks/useAuth";

export default function Component() {
	const { user, logout } = useAuth();

	return (
		<div className="container mx-auto p-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-4xl font-bold">Dashboard</h1>
				<div className="flex items-center gap-4">
					<span>Welcome, {user?.displayName}!</span>
					<button
						onClick={logout}
						className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
					>
						Logout
					</button>
				</div>
			</div>
			<div className="grid gap-6">
				<div className="p-6 bg-white rounded-lg shadow">
					<h2 className="text-2xl font-semibold mb-4">Your Content</h2>
					<p>
						This is a protected page. Only authenticated users can see this.
					</p>
				</div>
			</div>
		</div>
	);
}
