export type UserRoles = "predictor" | "creator"

export interface User {
    _id: string;
    name: string;
    number: number;
    role: UserRoles;
    avatar: string;
    isVerified: boolean
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;

    login: () => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}