import { Paginated } from "../interfaces";

/**
 * User Data Transfer Objects for the User model.
 */

/**
 * Base DTO that maps to the Prisma User model.
 */
export interface UserDto {
	id: string;
	username: string;
	email: string;
	password: string;
	// Optional since "name" can be null in the Prisma model.
	name?: string | null;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * DTO used when returning user data to clients,
 * without exposing the password.
 */
export type UserWithoutPassword = Omit<UserDto, "password">;

/**
 * DTO for creating a new user.
 * Only includes the fields you'd submit when creating a user.
 */
export interface UserCreateDto {
	username: string;
	email: string;
	password: string;
	// "name" is optional.
	name?: string | null;
}

/**
 * DTO for updating an existing user.
 * All fields are optional since you might only update a subset of properties.
 */
export interface UserUpdateDto {
	username?: string;
	email?: string;
	password?: string;
	name?: string | null;
}

/**
 * User response format for API endpoints.
 */
export interface UserResponse {
	/** Indicates if the request was successful */
	success: boolean;
	/** Error message if the request failed */
	message?: string;
	/** User data, can be a single user or an array of users */
	result?: UserDto | UserDto[];
	/** Optional pagination metadata */
	pagination?: Paginated;
}
