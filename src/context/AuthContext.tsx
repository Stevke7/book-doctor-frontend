import React, {createContext, useContext, useState, ReactNode} from 'react';
import {AuthUser} from "../types/auth.types.ts";
import {jwtDecode} from "jwt-decode";

interface AuthContextType {
    user: AuthUser | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
    const [user, setUser] = useState<AuthUser | null>(null);

    const login = (token: string) => {
        if(!token) {
            throw new Error("No token provided");
        }
        localStorage.setItem('token', token );

        try {
            const decoded = jwtDecode(token);
            setUser(decoded);
        } catch (err) {
            console.error('Token decode error:', err);
            logout();
            throw new Error('Invalid token');
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
    )

}
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
}