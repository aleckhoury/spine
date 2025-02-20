import { type SearchResult } from "@spine/types";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import Client from "~/client";
import { Input } from "~/components/ui/input";
interface BookSearchProps {
	onSelect?: (result: SearchResult) => void;
	onResultsChange?: (results: SearchResult[]) => void;
	className?: string;
}

export function BookSearch({
	onSelect,
	onResultsChange,
	className,
}: BookSearchProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const [debouncedValue] = useDebounce(searchTerm, 500);
	const client = new Client("http://localhost:4000");

	const searchBooks = useCallback(
		async (query: string) => {
			if (!query) {
				setResults([]);
				onResultsChange?.([]);
				return;
			}

			try {
				const response = await client.search.search({
					query,
					maxResults: 5,
				});
				setResults(response.results);
				console.log("RESULTS", response.results);
				onResultsChange?.(response.results);
			} catch (error) {
				console.error("Error searching books:", error);
				setResults([]);
				onResultsChange?.([]);
			}
		},
		[onResultsChange]
	);

	// Effect to trigger search when debounced value changes
	useEffect(() => {
		searchBooks(debouncedValue);
	}, [debouncedValue, searchBooks]);

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	return (
		<div className="relative w-full">
			<Input
				type="search"
				placeholder="Search books... (⌘+K)"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className={className}
			/>

			{searchTerm.length > 0 && (
				<div className="absolute top-full mt-1 w-full bg-background border rounded-md shadow-lg z-10 max-h-[80vh] overflow-y-auto">
					<div className="p-4">
						{results.length === 0 ? (
							<p className="text-sm text-muted-foreground text-center py-6">
								No results found.
							</p>
						) : (
							<div className="space-y-4">
								<h3 className="text-sm font-medium">Books</h3>
								<div className="space-y-2">
									{results.map((result) => (
										<div
											key={result.id}
											className="flex gap-4 p-2 rounded-sm hover:bg-accent cursor-pointer"
											onClick={() => {
												setSearchTerm(result.title);
											}}
										>
											<div>
												<img
													src={result.thumbnail || ""}
													alt={result.title}
													width={100}
													className="h-auto object-contain"
												/>
											</div>
											<div className="flex flex-col">
												<p className="text-sm font-medium">{result.title}</p>
												<p className="text-sm font-medium">
													Published {result.publishedDate}
												</p>
												<p className="text-sm text-muted-foreground">
													{result.authors.join(", ")}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
