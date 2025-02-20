// backend/book-providers/googleBooks.provider.ts
import { secret } from "encore.dev/config";
import { Volume } from "../book-manager/google-books.types";
import { SearchResponse } from "../search/search.service";
import { BookProvider } from "./book-provider.interface";

// Google Books API base URL
const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";
const apiKey = secret("GCP_API_KEY");

export class GoogleBooksProviderService implements BookProvider {
	/**
	 * Retrieves a book from the Google Books API by ISBN.
	 */
	async getBook(isbn: string): Promise<Volume | null> {
		if (!apiKey()) {
			throw new Error("Google Books API key not configured");
		}

		const url = new URL(GOOGLE_BOOKS_API);
		url.searchParams.append("q", `isbn:${isbn}`);
		url.searchParams.append("key", apiKey());

		const response = await fetch(url, {
			method: "GET",
		});
		if (!response.ok) {
			throw new Error(`Google Books API error: ${response.statusText}`);
		}

		const data = await response.json();
		return data.items[0] as Volume;
	}

	/**
	 * Searches books via the Google Books API.
	 */
	async searchBooks(
		query: string,
		maxResults: number,
		startIndex: number
	): Promise<SearchResponse> {
		if (!apiKey()) {
			throw new Error("Google Books API key not configured");
		}

		const url = new URL(GOOGLE_BOOKS_API);
		url.searchParams.append("q", query);
		url.searchParams.append("country", "US");
		url.searchParams.append("maxResults", maxResults.toString());
		url.searchParams.append("startIndex", startIndex.toString());
		url.searchParams.append("key", apiKey());

		const response = await fetch(url, {
			method: "GET",
		});
		if (!response.ok) {
			throw new Error(`Google Books API error: ${response.statusText}`);
		}

		const data = (await response.json()) as GoogleBooksResponse;

		console.log("DATA", JSON.stringify(data.items, null, 2));

		return {
			results: (data.items || []).map(transformBookItem),
			totalResults: data.totalItems,
			hasMore: startIndex + maxResults < data.totalItems,
		};
	}
}
