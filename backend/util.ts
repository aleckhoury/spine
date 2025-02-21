import { SearchResult } from "@spine/types";
import { Volume } from "./book-manager/google-books.types";

// Helper to transform Google Books item to SearchResult
export const TransformBookItem = (item: Volume): SearchResult => {
	let isbn_13 = item.volumeInfo.industryIdentifiers?.find(
		(identifier) => identifier.type === "ISBN_13"
	)?.identifier;
	if (!isbn_13) {
		const isbn_10 = item.volumeInfo.industryIdentifiers?.find(
			(identifier) => identifier.type === "ISBN_10"
		)?.identifier;
		if (!isbn_10) {
			throw new Error("No ISBN-10 or ISBN-13 found for book");
		}
		isbn_13 = isbn10ToIsbn13(isbn_10);
	}

	return {
		id: item.id,
		isbn: isbn_13,
		title: item.volumeInfo.title,
		authors: item.volumeInfo.authors || [],
		thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
		publishedDate: item.volumeInfo.publishedDate || null,
	};
};

function isbn10ToIsbn13(isbn10: string) {
	if (!/^\d{9}[\dX]$/.test(isbn10)) {
		throw new Error("Invalid ISBN-10");
	}

	// Remove the ISBN-10 check digit and add "978" prefix
	const isbn13Without13thDigit = "978" + isbn10.substring(0, 9);

	// Calculate check digit for ISBN-13
	let sum = 0;
	for (let i = 0; i < 12; i++) {
		sum += parseInt(isbn13Without13thDigit[i]) * (i % 2 === 0 ? 1 : 3);
	}
	const checkDigit = (10 - (sum % 10)) % 10;

	return isbn13Without13thDigit + checkDigit;
}
