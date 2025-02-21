/**
 * Type definitions for the Google Books API Volume resource.
 * For more details, see:
 * https://developers.google.com/books/docs/v1/reference/volumes
 */

/**
 * Possible values for volumeInfo.printType.
 * (Could be defined as an enum if you prefer a stricter version.)
 */
export type PrintType = "BOOK" | "MAGAZINE";

/**
 * Possible industry identifier types.
 * (These values are from the documentation; additional values may exist.)
 */
export type IndustryIdentifierType = "ISBN_10" | "ISBN_13" | "ISSN" | "OTHER";

/**
 * Possible saleability values.
 */
export type Saleability = "FOR_SALE" | "FREE" | "NOT_FOR_SALE" | "FOR_PREORDER";

/**
 * Possible viewability values.
 */
export type Viewability = "PARTIAL" | "ALL_PAGES" | "NO_PAGES" | "UNKNOWN";

/**
 * Possible text-to-speech permission values.
 */
export type TextToSpeechPermission =
	| "ALLOWED"
	| "ALLOWED_FOR_ACCESSIBILITY"
	| "NOT_ALLOWED";

/**
 * Possible access view status values.
 */
export type AccessViewStatus =
	| "FULL_PURCHASED"
	| "FULL_PUBLIC_DOMAIN"
	| "SAMPLE"
	| "NONE";

/**
 * Industry Identifier for a volume.
 */
export interface IndustryIdentifier {
	/**
	 * Identifier type.
	 * Possible values: "ISBN_10", "ISBN_13", "ISSN", "OTHER"
	 */
	type: IndustryIdentifierType;
	identifier: string;
}

/**
 * Physical dimensions for a volume.
 */
export interface VolumeDimensions {
	height?: string; // in cm
	width?: string;
	thickness?: string;
}

/**
 * Image links for various sizes.
 */
export interface VolumeImageLinks {
	smallThumbnail?: string; // ~80 pixels wide
	thumbnail?: string; // ~128 pixels wide
	small?: string; // ~300 pixels wide
	medium?: string; // ~575 pixels wide
	large?: string; // ~800 pixels wide
	extraLarge?: string; // ~1280 pixels wide
}

/**
 * General volume information.
 */
export interface VolumeInfo {
	title: string;
	subtitle?: string;
	authors?: string[];
	publisher?: string;
	publishedDate?: string;
	description?: string;
	industryIdentifiers?: IndustryIdentifier[];
	pageCount?: number;
	dimensions?: VolumeDimensions;
	printType?: PrintType; // enum values: "BOOK" or "MAGAZINE"
	mainCategory?: string;
	categories?: string[];
	averageRating?: number;
	ratingsCount?: number;
	contentVersion?: string;
	imageLinks?: VolumeImageLinks;
	language?: string; // Two-letter ISO 639-1 code (e.g., "en", "fr")
	previewLink?: string;
	infoLink?: string;
	canonicalVolumeLink?: string;
}

/**
 * User-specific information for the volume.
 * (The structure for review and readingPosition are open-ended; these could be refined when more details are known.)
 */
export interface VolumeUserInfo {
	review?: any; // can be refined if the structure is known
	readingPosition?: any; // can be refined if the structure is known
	isPurchased?: boolean;
	isPreordered?: boolean;
	updated?: string; // RFC3339 date-time string
}

/**
 * Represents a price with an amount and currency code.
 */
export interface Price {
	amount: number;
	currencyCode: string;
}

/**
 * Sale information associated with the volume.
 */
export interface VolumeSaleInfo {
	country?: string;
	saleability?: Saleability; // enum possible values: FOR_SALE, FREE, NOT_FOR_SALE, FOR_PREORDER
	onSaleDate?: string; // RFC3339 date-time string
	isEbook?: boolean;
	listPrice?: Price;
	retailPrice?: Price;
	buyLink?: string;
}

/**
 * Epub or PDF format availability.
 */
export interface VolumeFormatAvailability {
	isAvailable: boolean;
	downloadLink?: string;
	acsTokenLink?: string;
}

/**
 * Information about download access restrictions.
 */
export interface DownloadAccess {
	kind: string; // e.g., "books#downloadAccessRestriction"
	volumeId: string;
	restricted: boolean;
	deviceAllowed: boolean;
	justAcquired: boolean;
	maxDownloadDevices: number;
	downloadsAcquired: number;
	nonce?: string;
	source?: string;
	reasonCode?: string; // e.g. "0 OK", "100 ACCESS_DENIED_PUBLISHER_LIMIT"
	message?: string;
	signature?: string;
}

/**
 * Access information related to reading or obtaining the book text.
 */
export interface VolumeAccessInfo {
	country?: string;
	viewability?: Viewability; // enum: PARTIAL, ALL_PAGES, NO_PAGES, UNKNOWN
	embeddable?: boolean;
	publicDomain?: boolean;
	textToSpeechPermission?: TextToSpeechPermission; // enum: ALLOWED, ALLOWED_FOR_ACCESSIBILITY, NOT_ALLOWED
	epub?: VolumeFormatAvailability;
	pdf?: VolumeFormatAvailability;
	webReaderLink?: string;
	accessViewStatus?: AccessViewStatus; // enum: FULL_PURCHASED, FULL_PUBLIC_DOMAIN, SAMPLE, NONE
	downloadAccess?: DownloadAccess;
}

/**
 * Search result information for the volume.
 */
export interface VolumeSearchInfo {
	textSnippet?: string;
}

/**
 * Full Volume resource type as returned by the Google Books API.
 */
export interface Volume {
	kind: string; // e.g., "books#volume"
	id: string;
	etag: string;
	selfLink: string;
	volumeInfo: VolumeInfo;
	userInfo?: VolumeUserInfo;
	saleInfo?: VolumeSaleInfo;
	accessInfo: VolumeAccessInfo;
	searchInfo?: VolumeSearchInfo;
}

export interface GoogleBooksResponse {
	items: Volume[];
	totalItems: number;
	kind: string;
}
