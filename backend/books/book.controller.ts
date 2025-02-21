import { api, APIError } from "encore.dev/api";
import {
	BookCreateDto,
	BookResponse,
	BookUpdateDto,
	UserBookCreateDto,
	UserBookResponse,
	UserBookUpdateDto,
} from "./book.interface";
import BookService from "./book.service";

/**
 * Create a new book
 */
export const createBook = api(
	{ method: "POST", expose: true, path: "/books" },
	async (params: BookCreateDto): Promise<BookResponse> => {
		try {
			return await BookService.create(params);
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error creating book");
		}
	}
);

/**
 * Get book details
 */
export const getBook = api(
	{ method: "GET", expose: true, path: "/books/:id" },
	async ({ id }: { id: string }): Promise<BookResponse> => {
		try {
			return await BookService.findOneByISBN(id);
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error getting book");
		}
	}
);

/**
 * Get all books with optional pagination
 */
export const getBooks = api(
	{ method: "GET", expose: true, path: "/books" },
	async ({
		page,
		limit,
	}: {
		page?: number;
		limit?: number;
	}): Promise<BookResponse> => {
		try {
			return await BookService.find(page, limit);
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error getting books");
		}
	}
);

/**
 * Update book information
 */
export const updateBook = api(
	{ method: "PATCH", expose: true, path: "/books/:id" },
	async ({
		id,
		data,
	}: {
		id: string;
		data: BookUpdateDto;
	}): Promise<BookResponse> => {
		try {
			return await BookService.update(id, data);
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error updating book");
		}
	}
);

/**
 * Delete a book
 */
export const deleteBook = api(
	{ method: "DELETE", expose: true, path: "/books/:id" },
	async ({ id }: { id: string }): Promise<BookResponse> => {
		try {
			return await BookService.delete(id);
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error deleting book");
		}
	}
);

/**
 * Create a user-book relationship
 */
export const createUserBook = api(
	{ method: "POST", expose: true, path: "/users/:userId/books" },
	async ({
		userId,
		...data
	}: UserBookCreateDto & { userId: string }): Promise<UserBookResponse> => {
		try {
			return await BookService.createUserBook(userId, data);
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error creating user book");
		}
	}
);

/**
 * Get user-book details
 */
export const getUserBook = api(
	{ method: "GET", expose: true, path: "/users/books/:id" },
	async ({ id }: { id: string }): Promise<UserBookResponse> => {
		try {
			return await BookService.findOneUserBook(id);
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error getting user book");
		}
	}
);

/**
 * Get all user-books with optional pagination
 */
export const getUserBooks = api(
	{ method: "GET", expose: true, path: "/users/:userId/books" },
	async ({
		userId,
		page,
		limit,
	}: {
		userId: string;
		page?: number;
		limit?: number;
	}): Promise<UserBookResponse> => {
		try {
			return await BookService.findUserBooks(userId, page, limit);
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error getting user books");
		}
	}
);

/**
 * Update user-book information
 */
export const updateUserBook = api(
	{ method: "PATCH", expose: true, path: "/users/books/:id" },
	async ({
		id,
		data,
	}: {
		id: string;
		data: UserBookUpdateDto;
	}): Promise<UserBookResponse> => {
		try {
			return await BookService.updateUserBook(id, data);
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error updating user book");
		}
	}
);

/**
 * Delete a user-book relationship
 */
export const deleteUserBook = api(
	{ method: "DELETE", expose: true, path: "/users/books/:id" },
	async ({ id }: { id: string }): Promise<UserBookResponse> => {
		try {
			return await BookService.deleteUserBook(id);
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error deleting user book");
		}
	}
);
