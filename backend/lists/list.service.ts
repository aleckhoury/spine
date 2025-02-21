import prisma from "../database/prismaClient";
import { getOffset, paginatedData } from "../utils";
import {
	ListCreateDto,
	ListItemCreateDto,
	ListItemDto,
	ListItemResponse,
	ListItemUpdateDto,
	ListResponse,
	ListUpdateDto,
} from "./list.interface";

const ListService = {
	count: async (): Promise<number> => {
		const count = await prisma.list.count();
		return count;
	},

	create: async (data: ListCreateDto): Promise<ListResponse> => {
		const list = await prisma.list.create({ data });
		return {
			success: true,
			result: list,
		};
	},

	update: async (id: string, data: ListUpdateDto): Promise<ListResponse> => {
		const list = await prisma.list.findFirst({ where: { id } });
		if (!list) {
			return {
				success: false,
				message: "List not found",
			};
		}
		const updated = await prisma.list.update({
			where: { id },
			data: { ...data },
		});
		return {
			success: true,
			result: updated,
		};
	},

	// find: async (
	// 	userId: string,
	// 	page?: number,
	// 	limit?: number
	// ): Promise<ListResponse> => {
	// 	let lists: ListDto[] = [];
	// 	let pagination: any = undefined;
	// 	if (page && limit) {
	// 		const offset = getOffset(page, limit);
	// 		const count = await prisma.list.count({ where: { userId } });
	// 		lists = (
	// 			await prisma.list.findMany({
	// 				where: { userId },
	// 				take: limit,
	// 				skip: offset,
	// 				include: { listItems: true },
	// 			})
	// 		).map((list) => ({
	// 			...list,
	// 			listItems: list.listItems.map((item) => ({
	// 				...item,
	// 				position: item.position,
	// 			})),
	// 		}));
	// 		pagination = paginatedData({ size: limit, page, count });
	// 	} else {
	// 		lists = (
	// 			await prisma.list.findMany({
	// 				where: { userId },
	// 				include: { listItems: true },
	// 			})
	// 		).map((list) => ({
	// 			...list,
	// 			listItems: list.listItems.map((item) => ({
	// 				...item,
	// 				position: item.position,
	// 			})),
	// 		}));
	// 	}
	// 	return {
	// 		success: true,
	// 		result: lists,
	// 		pagination,
	// 	};
	// },

	findOne: async (id: string): Promise<ListResponse> => {
		const list = await prisma.list.findFirst({
			where: { id },
			include: { listItems: true },
		});
		if (!list) {
			return {
				success: false,
				message: "List not found",
			};
		}
		return {
			success: true,
			result: {
				...list,
				listItems: list.listItems.map((item) => ({
					...item,
					position: item.position,
				})),
			},
		};
	},

	delete: async (id: string): Promise<ListResponse> => {
		const list = await prisma.list.findFirst({ where: { id } });
		if (!list) {
			return {
				success: false,
				message: "List not found",
			};
		}
		await prisma.list.delete({ where: { id } });
		return {
			success: true,
		};
	},

	// ListItem specific methods
	createListItem: async (
		data: ListItemCreateDto & { listId: string }
	): Promise<ListItemResponse> => {
		const listItem = await prisma.listItem.create({ data });
		return {
			success: true,
			result: { ...listItem, position: listItem.position },
		};
	},

	updateListItem: async (
		id: string,
		data: ListItemUpdateDto
	): Promise<ListItemResponse> => {
		const listItem = await prisma.listItem.findFirst({ where: { id } });
		if (!listItem) {
			return {
				success: false,
				message: "List item not found",
			};
		}
		const updated = await prisma.listItem.update({
			where: { id },
			data: { ...data },
		});
		return {
			success: true,
			result: { ...updated, position: updated.position },
		};
	},

	findListItems: async (
		listId: string,
		page?: number,
		limit?: number
	): Promise<ListItemResponse> => {
		let listItems: ListItemDto[] = [];
		let pagination: any = undefined;
		if (page && limit) {
			const offset = getOffset(page, limit);
			const count = await prisma.listItem.count({ where: { listId } });
			const items = await prisma.listItem.findMany({
				where: { listId },
				take: limit,
				skip: offset,
				orderBy: { position: "asc" },
			});
			listItems = items.map((item) => ({
				...item,
				position: item.position,
			}));
			pagination = paginatedData({ size: limit, page, count });
		} else {
			const items = await prisma.listItem.findMany({
				where: { listId },
				orderBy: { position: "asc" },
			});
			listItems = items.map((item) => ({
				...item,
				position: item.position,
			}));
		}
		return {
			success: true,
			result: listItems,
			pagination,
		};
	},

	findOneListItem: async (id: string): Promise<ListItemResponse> => {
		const listItem = await prisma.listItem.findFirst({ where: { id } });
		if (!listItem) {
			return {
				success: false,
				message: "List item not found",
			};
		}
		return {
			success: true,
			result: { ...listItem, position: listItem.position },
		};
	},

	deleteListItem: async (id: string): Promise<ListItemResponse> => {
		const listItem = await prisma.listItem.findFirst({ where: { id } });
		if (!listItem) {
			return {
				success: false,
				message: "List item not found",
			};
		}
		await prisma.listItem.delete({ where: { id } });
		return {
			success: true,
		};
	},
};

export default ListService;
