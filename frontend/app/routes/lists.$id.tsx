import { type LoaderFunctionArgs, useLoaderData } from "react-router";
import Client from "~/client";
import { BookSearch } from "~/components/custom/BookSearch";

export async function loader({ params }: LoaderFunctionArgs) {
	const client = new Client("http://localhost:4000");
	const list = await client.lists.getList(params.id);
	return { list };
}

const client = new Client("http://localhost:4000");

export default function ListPage() {
	const { list } = useLoaderData<typeof loader>();

	const addBook = (book: any) => {};

	return (
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-6">{list.name}</h1>

			{list.listItems && list.listItems.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{list.listItems.map((item: any) => (
						<div key={item.id} className="border rounded-lg p-4">
							<h3 className="font-medium">{item.title}</h3>
							{item.authors && (
								<p className="text-sm text-muted-foreground">
									{item.authors.join(", ")}
								</p>
							)}
						</div>
					))}
				</div>
			) : (
				<p className="text-muted-foreground">No items in this list yet.</p>
			)}
			<BookSearch onSelect={addBook} />
		</div>
	);
}
