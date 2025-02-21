import { type LoaderFunctionArgs, useLoaderData } from "react-router";
import Client from "~/client";

export async function loader({ params }: LoaderFunctionArgs) {
	const client = new Client("http://localhost:4000");
	if (!params.isbn) {
		throw new Response("ISBN is required", { status: 404 });
	}
	const book = await client.books.getBook(params.isbn);
	return { book };
}

export default function BookPage() {
	const response = useLoaderData<typeof loader>();
	const book = response.book.result!;
	const bookImages = book?.image ?? {};
	console.log("BOOK IMAGES", bookImages);
	return (
		<div className="container mx-auto py-8">
			<div className="max-w-2xl mx-auto">
				<div className="flex gap-8">
					{Object.keys(bookImages).length > 0 && (
						<img
							src={bookImages.thumbnail as string}
							alt={book.title}
							className="w-48 max-h-72 object-contain rounded-lg shadow-lg"
						/>
					)}

					<div className="flex-1">
						<h1 className="text-3xl font-bold mb-2">{book?.title}</h1>

						{book?.subtitle && <p className="text-xl  mb-4">{book.subtitle}</p>}

						{book?.authors && book.authors.length > 0 && (
							<p className="text-lg  mb-4">by {book.authors.join(", ")}</p>
						)}

						{book?.publishedDate && (
							<p className="text-sm mb-2">
								Published: {book.publishedDate.toString()}
							</p>
						)}

						{book?.pages && <p className="text-sm mb-4">{book.pages} pages</p>}

						{book?.description && (
							<div className="mb-6">
								<h2 className="text-xl font-semibold mb-2">Description</h2>
								<p className="">{book.description}</p>
							</div>
						)}

						{book?.categories && book.categories.length > 0 && (
							<div>
								<h2 className="text-xl font-semibold mb-2">Categories</h2>
								<p className="">{book.categories.join(", ")}</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
