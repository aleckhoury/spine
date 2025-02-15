/**
 * Book and UserBook Data Transfer Objects and Response types.
 */

import { Paginated } from "../interfaces";

/**
 * Represents the reading status of a book for a user.
 */
type ReadingStatus = "NOT_STARTED" | "READING" | "COMPLETED" | "ABANDONED";

/**
 * Base DTO that maps to the Prisma Book model.
 */
export interface BookDto {
	id: string;
	title: string;
	isbn?: string | null;
	datePublished?: Date | null;
	pages?: number | null;
	overview?: string | null;
	image?: string | null;
	synopsis?: string | null;
	authors: string[];
	createdAt: Date;
	updatedAt: Date;
}

/**
 * DTO for creating a new book.
 * Only includes the fields you'd submit when creating a book.
 */
export interface BookCreateDto {
	title: string;
	isbn?: string;
	datePublished?: Date;
	pages?: number;
	overview?: string;
	image?: string;
	synopsis?: string;
	authors: string[];
}

/**
 * DTO for updating an existing book.
 * All fields are optional since you might only update a subset of properties.
 * The id field is required to identify the book to update.
 */
export interface BookUpdateDto {
	title?: string;
	isbn?: string;
	datePublished?: Date;
	pages?: number;
	overview?: string;
	image?: string;
	synopsis?: string;
	authors?: string[];
}

/**
 * Base DTO that maps to the Prisma UserBook model.
 * Represents a user's relationship with a specific book.
 */
export interface UserBookDto {
	id: string;
	userId: string;
	bookId: string;
	owned: boolean;
	readingStatus: ReadingStatus;
	review?: string | null;
	rating?: number | null;
	progress?: number | null;
	startedAt?: Date | null;
	finishedAt?: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * DTO for creating a new user-book relationship.
 * Only includes the fields you'd submit when creating a user-book entry.
 */
export interface UserBookCreateDto {
	bookId: string;
	owned?: boolean;
	readingStatus?: ReadingStatus;
	rating?: number | null;
	review?: string | null;
	progress?: number | null;
	startedAt?: Date | null;
	finishedAt?: Date | null;
}

/**
 * DTO for updating an existing user-book relationship.
 * All fields are optional since you might only update a subset of properties.
 * The id field is required to identify the user-book entry to update.
 */
export interface UserBookUpdateDto {
	owned?: boolean;
	readingStatus?: ReadingStatus;
	rating?: number | null;
	review?: string | null;
	progress?: number | null;
	startedAt?: Date | null;
	finishedAt?: Date | null;
}

/**
 * Book response format for API endpoints.
 */
export interface BookResponse {
	/** Indicates if the request was successful */
	success: boolean;
	/** Error message if the request failed */
	message?: string;
	/** Book data, can be a single book or an array of books */
	result?: BookDto | BookDto[];
	/** Optional pagination metadata */
	pagination?: Paginated;
}

/**
 * UserBook response format for API endpoints.
 */
export interface UserBookResponse {
	/** Indicates if the request was successful */
	success: boolean;
	/** Error message if the request failed */
	message?: string;
	/** UserBook data, can be a single user-book relationship or an array */
	result?: UserBookDto | UserBookDto[];
	/** Optional pagination metadata */
	pagination?: Paginated;
}
