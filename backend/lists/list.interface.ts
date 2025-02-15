import { Paginated } from "../interfaces";

/**
 * List and ListItem Data Transfer Objects and Response types.
 */

/**
 * Base DTO that maps to the Prisma List model.
 * Can optionally include nested ListItems.
 */
export interface ListDto {
	id: string;
	name: string;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
	// Optionally include list items if needed
	listItems?: ListItemDto[];
}

/**
 * DTO for creating a new List.
 * The owning user's ID is typically derived from the session context.
 */
export interface ListCreateDto {
	name: string;
	userId: string;
}

/**
 * DTO for updating an existing List.
 * All fields are optional since you might only update a subset of properties.
 * The id field is required to identify the list to update.
 */
export interface ListUpdateDto {
	name?: string;
}

/**
 * Base DTO that maps to the Prisma ListItem model.
 */
export interface ListItemDto {
	id: string;
	listId: string;
	userBookId: string;
	// Note: Prisma returns Decimal for this field.
	// Representing it as a string ensures clients handle large or precise values.
	position: string;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * DTO for creating a new ListItem.
 * The list association is provided via list context,
 * so only the related userBookId (and optionally a custom position) is supplied.
 */
export interface ListItemCreateDto {
	userBookId: string;
	// Optional position allows the database default to apply if omitted
	position?: string;
}

/**
 * DTO for updating an existing ListItem.
 * Only the ordering position is updateable.
 * The id field is required to identify the list item to update.
 */
export interface ListItemUpdateDto {
	position?: string;
}

/**
 * List response format for API endpoints.
 */
export interface ListResponse {
	/** Indicates if the request was successful */
	success: boolean;
	/** Error message if the request failed */
	message?: string;
	/** List data, can be a single list or an array of lists */
	result?: ListDto | ListDto[];
	/** Optional pagination metadata */
	pagination?: Paginated;
}

/**
 * ListItem response format for API endpoints.
 */
export interface ListItemResponse {
	/** Indicates if the request was successful */
	success: boolean;
	/** Error message if the request failed */
	message?: string;
	/** ListItem data, can be a single list item or an array of list items */
	result?: ListItemDto | ListItemDto[];
	/** Optional pagination metadata */
	pagination?: Paginated;
}
