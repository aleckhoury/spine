const OPEN_LIBRARY_API = "https://openlibrary.org/search.json";

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

		console.log("DATA", data);

		return {
			results: (data.docs || []).map(transformBookItem),
			totalResults: data.numFound,
			hasMore: startIndex + maxResults < data.numFound,
		};
	},
};

export default SearchService;
