import { BookProviders } from "../book-providers/book-provider.registry";
import { BookDto } from "../books/book.interface";
import prisma from "../database/prismaClient";
import { VolumeImageLinks } from "./google-books.types";

const googleProvider = BookProviders.google;

const BookManagerService = {
	getBook: async (isbn: string): Promise<BookDto | null> => {
		console.log("GETTING BOOK", isbn);
		const book = await prisma.book.findFirst({
			where: {
				isbn,
			},
		});
		console.log("BOOK", book);
		if (book) {
			return {
				...book,
				image: book.image as VolumeImageLinks,
			};
		}
		try {
			console.log("GETTING GOOGLE BOOK", isbn);
			const googleBook = await googleProvider.getBook(isbn);
			console.log("GOOGLE BOOK", googleBook);
			if (!googleBook) {
				throw new Error("Book not found");
			}
			const newBook = await prisma.book.create({
				data: {
					isbn,
					title: googleBook.volumeInfo.title,
					subtitle: googleBook.volumeInfo.subtitle || null,
					authors: googleBook.volumeInfo.authors || [],
					publishedDate: googleBook.volumeInfo.publishedDate
						? new Date(googleBook.volumeInfo.publishedDate)
						: null,
					pages: googleBook.volumeInfo.pageCount || null,
					description: googleBook.volumeInfo.description || null,
					image: googleBook.volumeInfo.imageLinks
						? { ...googleBook.volumeInfo.imageLinks }
						: undefined,
					mainCategory: googleBook.volumeInfo.mainCategory || null,
					categories: googleBook.volumeInfo.categories || [],
				},
			});
			return {
				...newBook,
				image: newBook.image as VolumeImageLinks,
			};
		} catch (error) {
			throw new Error("Error creating book");
		}
	},
};

export default BookManagerService;
