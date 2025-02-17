import { useAuth } from "~/hooks/useAuth";

export default function Component() {
	const { user } = useAuth();

	return (
		<div className="container mx-auto p-8">
			<h1 className="text-4xl font-bold mb-8">Profile</h1>
			<div className="bg-white rounded-lg shadow p-6">
				<div className="grid gap-4">
					<div>
						<label className="font-semibold">Display Name</label>
						<p>{user?.displayName}</p>
					</div>
					<div>
						<label className="font-semibold">Email</label>
						<p>{user?.email}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
