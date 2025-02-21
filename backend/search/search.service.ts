import { SearchResponse } from "@spine/types";
import { TransformBookItem } from "../util";

const OPEN_LIBRARY_API = "https://openlibrary.org/search.json";

const SearchService = {
	searchOpenLibrary: async (
		query: string,
		maxResults: number,
		startIndex: number = 0
	): Promise<SearchResponse> => {
		const url = new URL(OPEN_LIBRARY_API);
		url.searchParams.append("q", query);
		// url.searchParams.append("maxResults", maxResults.toString());
		// url.searchParams.append("startIndex", startIndex.toString());
		// url.searchParams.append("limit", maxResults.toString());
		// url.searchParams.append("sort", "edition_count_desc");

		const response = await fetch(url, {
			method: "GET",
		});
		console.log("RESPONSE", response);
		if (!response.ok) {
			throw new Error(`Open Library API error: ${response.statusText}`);
		}

		const data = await response.json();

		return {
			results: (data.docs || []).map(TransformBookItem),
			totalResults: data.numFound,
			hasMore: startIndex + maxResults < data.numFound,
		};
	},
};

export default SearchService;
