import { Decimal } from "decimal.js";
import { api, APIError } from "encore.dev/api";
import { UUID } from "node:crypto";
import BookManagerService from "../book-manager/book-manager.service";
import prisma from "../database/prismaClient";
import {
	ListCreateDto,
	ListItemCreateDto,
	ListItemResponse,
	ListItemUpdateDto,
	ListResponse,
	ListUpdateDto,
} from "./list.interface";
import ListService from "./list.service";

/**
 * Create a new list
 */
export const createList = api(
	{ method: "POST", expose: true, path: "/lists" },
	async (params: ListCreateDto): Promise<ListResponse> => {
		try {
			return await ListService.create(params);
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error creating list");
		}
	}
);

export const addBookToListFromSearch = api(
	{ method: "POST", expose: true, path: "/lists/:listId/add-from-search" },
	async (params: {
		listId: UUID;
		isbn: string;
		userId: string;
	}): Promise<any> => {
		try {
			const book = await BookManagerService.getBook(params.isbn);
			const userBook = await prisma.userBook.create({
				data: {
					bookId: book.id,
					userId: params.userId,
				},
			});
			const list = await prisma.list.findFirst({
				where: {
					id: params.listId,
					userId: params.userId,
				},
				include: {
					listItems: {
						orderBy: {
							position: "desc",
						},
						take: 1,
					},
				},
			});

			if (!list) {
				throw APIError.notFound("List not found");
			}

			const lastPosition = list.listItems[0]?.position || new Decimal(0);

			// Calculate new position - if there are no items, use 1000000, otherwise add 1000000 to last position
			const defaultPosition = lastPosition.add(new Decimal(1000000));

			return await ListService.createListItem({
				listId: params.listId,
				userBookId: userBook.id,
				position: defaultPosition.toString(),
			});
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error adding book to list");
		}
	}
);

/**
 * Get list details
 */
export const getList = api(
	{ method: "GET", expose: true, path: "/lists/:id" },
	async ({ id }: { id: string }): Promise<ListResponse> => {
		try {
			return await ListService.findOne(id);
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error getting list");
		}
	}
);

/**
 * Get all lists for a user with optional pagination
 */
export const getLists = api(
	{ method: "GET", expose: true, path: "/users/:userId/lists" },
	async ({
		userId,
		page,
		limit,
	}: {
		userId: string;
		page?: number;
		limit?: number;
	}): Promise<ListResponse> => {
		try {
			return await ListService.find(userId, page, limit);
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error getting lists");
		}
	}
);

/**
 * Update list information
 */
export const updateList = api(
	{ method: "PATCH", expose: true, path: "/lists/:id" },
	async ({
		id,
		data,
	}: {
		id: string;
		data: ListUpdateDto;
	}): Promise<ListResponse> => {
		try {
			return await ListService.update(id, data);
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error updating list");
		}
	}
);

/**
 * Delete a list
 */
export const deleteList = api(
	{ method: "DELETE", expose: true, path: "/lists/:id" },
	async ({ id }: { id: string }): Promise<ListResponse> => {
		try {
			return await ListService.delete(id);
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error deleting list");
		}
	}
);

/**
 * Create a new list item
 */
export const createListItem = api(
	{ method: "POST", expose: true, path: "/lists/:listId/items" },
	async ({
		listId,
		...data
	}: ListItemCreateDto & { listId: string }): Promise<ListItemResponse> => {
		try {
			return await ListService.createListItem({ ...data, listId });
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error creating list item");
		}
	}
);

/**
 * Get list item details
 */
export const getListItem = api(
	{ method: "GET", expose: true, path: "/lists/items/:id" },
	async ({ id }: { id: string }): Promise<ListItemResponse> => {
		try {
			return await ListService.findOneListItem(id);
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error getting list item");
		}
	}
);

/**
 * Get all items in a list with optional pagination
 */
export const getListItems = api(
	{ method: "GET", expose: true, path: "/lists/:listId/items" },
	async ({
		listId,
		page,
		limit,
	}: {
		listId: string;
		page?: number;
		limit?: number;
	}): Promise<ListItemResponse> => {
		try {
			return await ListService.findListItems(listId, page, limit);
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error getting list items");
		}
	}
);

/**
 * Update list item information
 */
export const updateListItem = api(
	{ method: "PATCH", expose: true, path: "/lists/items/:id" },
	async ({
		id,
		data,
	}: {
		id: string;
		data: ListItemUpdateDto;
	}): Promise<ListItemResponse> => {
		try {
			return await ListService.updateListItem(id, data);
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error updating list item");
		}
	}
);

/**
 * Delete a list item
 */
export const deleteListItem = api(
	{ method: "DELETE", expose: true, path: "/lists/items/:id" },
	async ({ id }: { id: string }): Promise<ListItemResponse> => {
		try {
			return await ListService.deleteListItem(id);
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error deleting list item");
		}
	}
);
