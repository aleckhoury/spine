import { type LoaderFunctionArgs, useLoaderData } from "react-router";
import Client from "~/client";

export async function loader({ params }: LoaderFunctionArgs) {
	const client = new Client("http://localhost:4000");
	const book = await client.books.getBook(params.isbn);
	return { book };
}

export default function BookPage() {
	const { book } = useLoaderData<typeof loader>();

	return (
		<div className="container mx-auto py-8">
			<div className="max-w-2xl mx-auto">
				<div className="flex gap-8">
					{book.image && (
						<img
							src={book.image}
							alt={book.title}
							className="w-48 h-auto object-cover rounded-lg shadow-lg"
						/>
					)}

					<div className="flex-1">
						<h1 className="text-3xl font-bold mb-2">{book.title}</h1>

						{book.authors && (
							<p className="text-lg text-muted-foreground mb-4">
								by {book.authors.join(", ")}
							</p>
						)}

						{book.datePublished && (
							<p className="text-sm text-muted-foreground mb-2">
								Published: {new Date(book.datePublished).toLocaleDateString()}
							</p>
						)}

						{book.pages && (
							<p className="text-sm text-muted-foreground mb-4">
								{book.pages} pages
							</p>
						)}

						{book.overview && (
							<div className="mb-6">
								<h2 className="text-xl font-semibold mb-2">Overview</h2>
								<p className="text-muted-foreground">{book.overview}</p>
							</div>
						)}

						{book.synopsis && (
							<div>
								<h2 className="text-xl font-semibold mb-2">Synopsis</h2>
								<p className="text-muted-foreground">{book.synopsis}</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
