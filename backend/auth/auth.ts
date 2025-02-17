import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { api, APIError, Gateway, Header } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { secret } from "encore.dev/config";
import jwt from "jsonwebtoken";
import prisma from "../database/prismaClient";

// Secrets for JWT signing
const jwtSecret = secret("JWT_SECRET");
const refreshSecret = secret("REFRESH_TOKEN_SECRET");

interface TokenPair {
	accessToken: string;
	refreshToken: string;
}

interface SignupParams {
	email: string;
	username: string;
	password: string;
}

// Token generation functions
function generateAccessToken(userId: string): string {
	return jwt.sign({ userId }, jwtSecret(), {
		expiresIn: "15m", // Access tokens expire in 15 minutes
	});
}

function generateRefreshToken(userId: string): string {
	return jwt.sign({ userId }, refreshSecret(), {
		expiresIn: "30d", // Refresh tokens expire in 30 days
	});
}

async function createRefreshToken(
	userId: string,
	token: string
): Promise<void> {
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

	await prisma.refreshToken.create({
		data: {
			token,
			userId,
			expiresAt,
		},
	});
}

async function generateTokenPair(userId: string): Promise<TokenPair> {
	const accessToken = generateAccessToken(userId);
	const refreshToken = generateRefreshToken(userId);

	// Store refresh token in database
	await createRefreshToken(userId, refreshToken);

	return {
		accessToken,
		refreshToken,
	};
}

// Update signup endpoint
export const signup = api(
	{ expose: true, auth: false, method: "POST" },
	async ({ email, username, password }: SignupParams): Promise<TokenPair> => {
		const existingUser = await prisma.user.findFirst({
			where: { OR: [{ email }, { username }] },
		});

		if (existingUser) {
			throw APIError.invalidArgument("Email or username already exists");
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: {
				email,
				username,
				password: hashedPassword,
			},
		});

		return generateTokenPair(user.id);
	}
);

interface LoginParams {
	identifier: string;
	password: string;
}

// Update login endpoint
export const login = api(
	{ expose: true, auth: false, method: "POST" },
	async ({ identifier, password }: LoginParams): Promise<TokenPair> => {
		const user = await prisma.user.findFirst({
			where: {
				OR: [{ email: identifier }, { username: identifier }],
			},
		});

		if (!user || !(await bcrypt.compare(password, user.password))) {
			throw APIError.unauthenticated("Invalid username/email or password");
		}

		return generateTokenPair(user.id);
	}
);

// Add refresh token endpoint
interface RefreshParams {
	refreshToken: string;
}

export const refresh = api(
	{ expose: true, auth: false, method: "POST" },
	async ({ refreshToken }: RefreshParams): Promise<TokenPair> => {
		try {
			// Verify the refresh token
			const decoded = jwt.verify(refreshToken, refreshSecret()) as {
				userId: string;
			};

			// Check if token exists and is not revoked
			const storedToken = await prisma.refreshToken.findFirst({
				where: {
					token: refreshToken,
					revokedAt: null,
					expiresAt: {
						gt: new Date(),
					},
				},
			});

			if (!storedToken) {
				throw APIError.unauthenticated("Invalid refresh token");
			}

			// Revoke the used refresh token
			await prisma.refreshToken.update({
				where: { id: storedToken.id },
				data: { revokedAt: new Date() },
			});

			// Generate new token pair
			return generateTokenPair(decoded.userId);
		} catch (error) {
			if (error instanceof jwt.TokenExpiredError) {
				throw APIError.unauthenticated("Refresh token expired");
			}
			throw APIError.unauthenticated("Invalid refresh token");
		}
	}
);

// Update logout endpoint
export const logout = api(
	{ method: "POST", expose: true, auth: true },
	async ({ refreshToken }: { refreshToken: string }): Promise<void> => {
		// Revoke the refresh token
		await prisma.refreshToken.updateMany({
			where: {
				token: refreshToken,
				revokedAt: null,
			},
			data: {
				revokedAt: new Date(),
			},
		});
	}
);

// The AuthData specifies the information about the authenticated user
// that the auth handler makes available.
interface AuthData {
	userID: string;
}

interface AuthParams {
	authorization: Header<"Authorization">;
}

// The auth handler itself.
export const auth = authHandler<AuthParams, AuthData>(async (params) => {
	try {
		if (!params.authorization) {
			throw APIError.unauthenticated("No authorization header provided");
		}

		// Verify the JWT token
		const decoded = jwt.verify(params.authorization, jwtSecret()) as {
			userId: string;
		};

		// Check if the user still exists
		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
		});

		if (!user) {
			throw APIError.unauthenticated("User not found");
		}

		return { userID: user.id };
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			throw APIError.unauthenticated("Invalid token");
		}
		if (error instanceof jwt.TokenExpiredError) {
			throw APIError.unauthenticated("Token expired");
		}
		throw error;
	}
});

export const gateway = new Gateway({
	authHandler: auth,
});

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

interface VerifyParams {
	token: string;
}

interface VerifiedUser {
	id: string;
	email: string;
	username: string;
}

export const verify = api(
	{ expose: true, auth: false, method: "POST" },
	async ({ token }: VerifyParams): Promise<VerifiedUser> => {
		try {
			const decoded = jwt.verify(token, jwtSecret()) as { userId: string };
			const user = await prisma.user.findUnique({
				where: { id: decoded.userId },
				select: {
					id: true,
					email: true,
					username: true,
				},
			});

			if (!user) {
				throw APIError.unauthenticated("Invalid token");
			}

			return user;
		} catch (error) {
			throw APIError.unauthenticated("Invalid or expired token");
		}
	}
);
