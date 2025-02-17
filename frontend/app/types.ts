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
	title: string;
	authors: string[];
	thumbnail: string | null;
	publishedDate: string | null;
}
