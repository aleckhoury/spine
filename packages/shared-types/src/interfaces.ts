export interface AuthUser {
	displayName: string;
	email: string;
	uid: string;
}

export interface AuthContextType {
	user: AuthUser | null;
	setUser: (user: AuthUser | null) => void;
}

export interface SearchResult {
	id: string;
	isbn: string | null;
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
