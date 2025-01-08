import React, {createContext, useContext, useState, useEffect} from 'react';
import {AuthUser} from "../types/auth.types.ts";
import {jwtDecode} from "jwt-decode";

interface AuthContextType {
    user: AuthUser | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

interface DecodedToken {
    userId: string;
    email: string;
    name: string;
    role: 'doctor' | 'patient'
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);



    const login = (token: string) => {
        if(!token) {
            throw new Error("No token provided");
        }

        console.log('Raw token received:', token);


        try {
            const decoded = jwtDecode<DecodedToken>(token);
            console.log('Decoded token:', decoded);
            if (!decoded.userId || !decoded.email || !decoded.role) {
                console.log('TOKEN', decoded)
                throw new Error('Invalid token structure');
            }

            if (decoded.role !== 'doctor' && decoded.role !== 'patient') {
                throw new Error("Invalid user role");
            }

            localStorage.setItem('token', token );

            setUser({
                id: decoded.userId,
                email: decoded.email,
                name: decoded.name,
                role: decoded.role
            });

            setIsAuthenticated(true);

        } catch (err) {
            console.error('Login error:', err);
            logout();
            throw new Error( err instanceof Error ? err.message : 'Invalid Token');
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);

                // const currentTime = Date.now() / 1000;
                // if (decoded.exp && decoded.exp < currentTime) {
                //     logout();
                //     return;
                // }
                setUser({
                    id: decoded.userId,
                    email: decoded.email,
                    name: decoded.name,
                    role: decoded.role
                });
                setIsAuthenticated(true);
            } catch (err) {
                console.error('Token validation error:', err);
                logout();
            }
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>{children}</AuthContext.Provider>
    )

}
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
}