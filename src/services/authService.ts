import api from "./api";
import {LoginCredentials, RegisterCredentials, AuthResponse} from "../types/auth.types.ts";

export const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        try{
            const {data} = await api.post<AuthResponse>('/users/login', credentials);
            console.log({data});
            return data;
        } catch(error){
            if(error instanceof AxiosError){
                throw Error(error.response?.data?.message || 'Login failed.');
            }
            throw error;
        }

    },

    register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        const {data} = await api.post<AuthResponse>('/users/register', credentials);
        return data;
    }
}