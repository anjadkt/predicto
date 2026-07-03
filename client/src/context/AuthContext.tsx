import { createContext, useEffect, useState } from "react";
import type { AuthContextType, User } from "../types/auth.types";
import { getProfile, logoutUser } from "../services/auth.service";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const data = await getProfile();
            setUser(data);
        } catch {
            setUser(null);
        }
    };

    const login = async () => {
        await refreshUser();
    };

    const logout = async () => {
        await logoutUser();
        setUser(null);
    };

    useEffect(() => {

        const initialize = async () => {
            await refreshUser();
            setLoading(false);
        };

        initialize();

    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};