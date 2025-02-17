import { createContext } from "react";
import type { AuthUser } from "~/types";

interface AuthContextType {
	user: AuthUser | null;
	setUser: (user: AuthUser | null) => void;
	login: (identifier: string, password: string) => Promise<boolean>;
	signup: (
		email: string,
		username: string,
		password: string
	) => Promise<boolean>;
	logout: () => Promise<boolean>;
	loading: boolean;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;
