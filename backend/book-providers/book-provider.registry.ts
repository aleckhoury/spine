// backend/book-providers/book-provider.registry.ts
import { GoogleBooksProviderService } from "./googleBooks.provider";
// import other providers as needed

export const BookProviders = {
	google: new GoogleBooksProviderService(),
	// openLibrary: new OpenLibraryProviderService(),
	// goodreads: new GoodreadsProviderService(),
};

// Example helper to select a provider by name
export function getBookProvider(providerName: keyof typeof BookProviders) {
	return BookProviders[providerName];
}
