import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import Client from "~/client";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "~/components/ui/command";
import { Input } from "~/components/ui/input";
import type { SearchResult } from "~/types";

interface BookSearchProps {
	onResultsChange?: (results: SearchResult[]) => void;
	className?: string;
}

export function BookSearch({ onResultsChange, className }: BookSearchProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [open, setOpen] = useState(false);
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
		<>
			<Input
				type="search"
				placeholder="Search books... (⌘+K)"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className={className}
				onClick={() => setOpen(true)}
			/>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput
					placeholder="Search books..."
					value={searchTerm}
					onValueChange={setSearchTerm}
				/>
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Books">
						{results.map((result) => (
							<CommandItem
								key={result.id}
								onSelect={() => {
									setSearchTerm(result.title);
									setOpen(false);
								}}
							>
								{result.title}
								{/* <span className="ml-2 text-muted-foreground">
									by {result.author}
								</span> */}
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
}
