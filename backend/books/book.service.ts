import prisma from "../database/prismaClient";
import { getOffset, paginatedData } from "../utils";
import {
	BookCreateDto,
	BookDto,
	BookResponse,
	BookUpdateDto,
	UserBookCreateDto,
	UserBookDto,
	UserBookResponse,
	UserBookUpdateDto,
} from "./book.interface";

const BookService = {
	count: async (): Promise<number> => {
		const count = await prisma.book.count();
		return count;
	},

	create: async (data: BookCreateDto): Promise<BookResponse> => {
		const book = await prisma.book.create({ data });
		return {
			success: true,
			result: book,
		};
	},

	update: async (id: string, data: BookUpdateDto): Promise<BookResponse> => {
		const book = await prisma.book.findFirst({ where: { id } });
		if (!book) {
			return {
				success: false,
				message: "Book not found",
			};
		}
		const updated = await prisma.book.update({
			where: { id },
			data: { ...data },
		});
		return {
			success: true,
			result: updated,
		};
	},

	find: async (page?: number, limit?: number): Promise<BookResponse> => {
		let books: BookDto[] = [];
		let pagination: any = undefined;
		if (page && limit) {
			const offset = getOffset(page, limit);
			const count = await prisma.book.count();
			books = await prisma.book.findMany({ take: limit, skip: offset });
			pagination = paginatedData({ size: limit, page, count });
		} else {
			books = await prisma.book.findMany();
		}
		return {
			success: true,
			result: books,
			pagination,
		};
	},

	findOne: async (id: string): Promise<BookResponse> => {
		const book = await prisma.book.findFirst({ where: { id } });
		if (!book) {
			return {
				success: false,
				message: "Book not found",
			};
		}
		return {
			success: true,
			result: book,
		};
	},

	delete: async (id: string): Promise<BookResponse> => {
		const book = await prisma.book.findFirst({ where: { id } });
		if (!book) {
			return {
				success: false,
				message: "Book not found",
			};
		}
		await prisma.book.delete({ where: { id } });
		return {
			success: true,
		};
	},

	// UserBook specific methods
	createUserBook: async (
		userId: string,
		data: UserBookCreateDto
	): Promise<UserBookResponse> => {
		const userBook = await prisma.userBook.create({
			data: {
				...data,
				userId,
			},
		});
		return {
			success: true,
			result: userBook,
		};
	},

	updateUserBook: async (
		id: string,
		data: UserBookUpdateDto
	): Promise<UserBookResponse> => {
		const userBook = await prisma.userBook.findFirst({ where: { id } });
		if (!userBook) {
			return {
				success: false,
				message: "User book not found",
			};
		}
		const updated = await prisma.userBook.update({
			where: { id },
			data: { ...data },
		});
		return {
			success: true,
			result: updated,
		};
	},

	findUserBooks: async (
		userId: string,
		page?: number,
		limit?: number
	): Promise<UserBookResponse> => {
		let userBooks: UserBookDto[] = [];
		let pagination: any = undefined;
		if (page && limit) {
			const offset = getOffset(page, limit);
			const count = await prisma.userBook.count({ where: { userId } });
			userBooks = await prisma.userBook.findMany({
				where: { userId },
				take: limit,
				skip: offset,
			});
			pagination = paginatedData({ size: limit, page, count });
		} else {
			userBooks = await prisma.userBook.findMany({ where: { userId } });
		}
		return {
			success: true,
			result: userBooks,
			pagination,
		};
	},

	findOneUserBook: async (id: string): Promise<UserBookResponse> => {
		const userBook = await prisma.userBook.findFirst({ where: { id } });
		if (!userBook) {
			return {
				success: false,
				message: "User book not found",
			};
		}
		return {
			success: true,
			result: userBook,
		};
	},

	deleteUserBook: async (id: string): Promise<UserBookResponse> => {
		const userBook = await prisma.userBook.findFirst({ where: { id } });
		if (!userBook) {
			return {
				success: false,
				message: "User book not found",
			};
		}
		await prisma.userBook.delete({ where: { id } });
		return {
			success: true,
		};
	},
};

export default BookService;
