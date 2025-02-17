import { secret } from "encore.dev/config";

// Google Books API base URL
const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

interface GoogleBooksResponse {
	items: BookItem[];
	totalItems: number;
	kind: string;
}

interface BookItem {
	id: string;
	volumeInfo: {
		title: string;
		authors?: string[];
		publishedDate?: string;
		description?: string;
		imageLinks?: {
			thumbnail?: string;
			smallThumbnail?: string;
		};
		industryIdentifiers?: {
			type: string;
			identifier: string;
		}[];
	};
}

interface SearchResult {
	id: string;
	title: string;
	authors: string[];
	thumbnail: string | null;
	publishedDate: string | null;
}

export interface SearchResponse {
	results: SearchResult[];
	totalResults: number;
	hasMore: boolean;
}

// Helper to transform Google Books item to SearchResult
function transformBookItem(item: BookItem): SearchResult {
	return {
		id: item.id,
		title: item.volumeInfo.title,
		authors: item.volumeInfo.authors || [],
		thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
		publishedDate: item.volumeInfo.publishedDate || null,
	};
}
const apiKey = secret("GCP_API_KEY");

const SearchService = {
	// Main search function that calls Google Books API
	searchBooks: async (
		query: string,
		maxResults: number,
		startIndex: number = 0
	): Promise<SearchResponse> => {
		if (!apiKey()) {
			throw new Error("Google Books API key not configured");
		}

		const url = new URL(GOOGLE_BOOKS_API);
		url.searchParams.append("q", query);
		url.searchParams.append("country", "US");
		// url.searchParams.append("maxResults", maxResults.toString());
		// url.searchParams.append("startIndex", startIndex.toString());
		url.searchParams.append("key", apiKey());

		const response = await fetch(url, {
			method: "GET",
		});
		if (!response.ok) {
			console.log("RESPONSE", response);
			throw new Error(`Google Books API error: ${response.statusText}`);
		}

		const data = (await response.json()) as GoogleBooksResponse;

		return {
			results: (data.items || []).map(transformBookItem),
			totalResults: data.totalItems,
			hasMore: startIndex + maxResults < data.totalItems,
		};
	},
};

export default SearchService;
