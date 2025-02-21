import { SearchResponse } from "@spine/types";
import { api, APIError } from "encore.dev/api";
import { BookProviders } from "../book-providers/book-provider.registry";

interface SearchParams {
	query: string;
	maxResults?: number;
	startIndex?: number;
}

/**
 * Search Google Books API
 */
export const search = api<SearchParams, SearchResponse>(
	{ method: "GET", expose: true, path: "/search" },
	async (params: SearchParams) => {
		try {
			const maxResults = params.maxResults || 5; // Default to 10 results
			const startIndex = params.startIndex || 0;
			if (!params.query) {
				throw APIError.aborted("Search query is required");
			}

			return await BookProviders.google.searchBooks(
				params.query,
				maxResults,
				startIndex
			);
		} catch (error) {
			throw APIError.aborted(
				error?.toString() || "Error searching Google Books API"
			);
		}
	}
);
