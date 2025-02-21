// backend/book-providers/book-provider.interface.ts
import { SearchResponse } from "@spine/types";
import { Volume } from "../book-manager/google-books.types";

export interface BookProvider {
	/**
	 * Retrieve a book by its ISBN.
	 */
	getBook(isbn: string): Promise<Volume | null>;

	/**
	 * Search for books by a query.
	 */
	searchBooks(
		query: string,
		maxResults: number,
		startIndex: number
	): Promise<SearchResponse>;
}
