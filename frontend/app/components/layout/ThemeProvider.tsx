import {
	ThemeProvider as NextThemesProvider,
	type ThemeProviderProps,
} from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return (
		<NextThemesProvider defaultTheme="system" enableSystem {...props}>
			{children}
		</NextThemesProvider>
	);
}
