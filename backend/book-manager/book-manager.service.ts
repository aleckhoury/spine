import { BookProviders } from "../book-providers/book-provider.registry";
import prisma from "../database/prismaClient";

const googleProvider = BookProviders.google;

const BookManagerService = {
	getBook: async (isbn: string) => {
		const book = await prisma.book.findUnique({
			where: {
				isbn,
			},
		});
		if (!book) {
			const googleBook = await googleProvider.getBook(isbn);
			if (!googleBook) {
				throw new Error("Book not found");
			}
			const newBook = await prisma.book.create({
				data: {
					isbn: googleBook.id,
					title: googleBook.volumeInfo.title,
					authors: googleBook.volumeInfo.authors,
				},
			});
			return newBook;
		}
		return book;
	},
};

export default BookManagerService;
