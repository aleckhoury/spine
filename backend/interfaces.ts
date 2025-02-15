/**
 * Standard API response format.
 */
export interface Response {
	/** Indicates if the request was successful */
	success: boolean;
	/** Error message if the request was not successful */
	message?: string;
	/** The result of the request (number or string) */
	result?: string | number;
}

export interface Paginated {
	/** Total number of results */
	count: number;
	/** Number of results per page */
	pageSize: number;
	/** Total number of pages */
	totalPages: number;
	/** Current page number */
	current: number;
}

// Enum to track the reading status for a user's copy
export enum ReadingStatus {
	NOT_STARTED = "NOT_STARTED",
	READING = "READING",
	COMPLETED = "COMPLETED",
	ABANDONED = "ABANDONED",
}
