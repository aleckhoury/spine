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
