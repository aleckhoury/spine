import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { api, APIError, Gateway, Header } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import prisma from "../database/prismaClient";

interface LoginParams {
	identifier: string;
	password: string;
}

export const login = api(
	{ expose: true, auth: false, method: "POST" },
	async ({ identifier, password }: LoginParams): Promise<{ token: string }> => {
		const user: User | null = await prisma.user.findFirst({
			where: {
				OR: [{ email: identifier }, { username: identifier }],
			},
		});

		if (!user || !(await bcrypt.compare(password, user.password))) {
			throw APIError.unauthenticated("Invalid username/email or password");
		}

		// Generate a token (for simplicity, using a placeholder function)
		const token = generateToken(user.id);
		return { token };
	}
);

// Placeholder function for token generation
function generateToken(userId: string): string {
	// Implement a proper token generation logic here
	return `token-${userId}`;
}

interface AuthParams {
	authorization: Header<"Authorization">;
}

// The AuthData specifies the information about the authenticated user
// that the auth handler makes available.
interface AuthData {
	userID: string;
}

// The auth handler itself.
export const auth = authHandler<AuthParams, AuthData>(async (params) => {
	// Now params.authorization is correctly typed and parsed from the "Authorization" header
	// Your authentication logic here...
	return { userID: "some-user-id" };
});

export const gateway = new Gateway({
	authHandler: auth,
});

// Logout endpoint
export const logout = api(
	{ method: "POST", expose: true, auth: true },
	async (): Promise<void> => {
		// Invalidate the user's session or token
		// For simplicity, this example does not implement token storage
	}
);

// Change password endpoint
export const changePassword = api(
	{ method: "POST", expose: true, auth: true },
	async ({
		userID,
		currentPassword,
		newPassword,
	}: {
		userID: string;
		currentPassword: string;
		newPassword: string;
	}): Promise<void> => {
		const user: User | null = await prisma.user.findUnique({
			where: { id: userID },
		});

		if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
			throw APIError.unauthenticated("Invalid current password");
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);
		await prisma.user.update({
			where: { id: userID },
			data: { password: hashedPassword },
		});
	}
);
