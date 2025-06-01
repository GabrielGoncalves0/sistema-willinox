'use client'

import { toast } from 'sonner';

const baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL || '';

interface ApiResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
}

interface HttpClient {
    get<T>(endpoint: string): Promise<ApiResponse<T>>;
    post<T>(endpoint: string, body: any): Promise<ApiResponse<T>>;
    postFormData<T>(endpoint: string, body: FormData): Promise<ApiResponse<T>>;
    putFormData<T>(endpoint: string, body: FormData): Promise<ApiResponse<T>>;
    put<T>(endpoint: string, body: any): Promise<ApiResponse<T>>;
    delete<T>(endpoint: string): Promise<ApiResponse<T>>;
}

const handleAuthError = () => {
    toast.error('Sessão expirada. Por favor, faça login novamente.');

    setTimeout(() => {
        window.location.href = '/';
    }, 1500);
};

const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        if (response.status === 401) {
            handleAuthError();
        }

        const error: any = new Error('Erro na requisição');
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return {
        data,
        status: response.status,
        statusText: response.statusText,
    };
};

const httpClient: HttpClient = {
    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        const response = await fetch(baseUrl + endpoint, {
            credentials: 'include',
        });
        return handleResponse(response);
    },

    async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
        const response = await fetch(baseUrl + endpoint, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        return handleResponse(response);
    },

    async postFormData<T>(endpoint: string, body: FormData): Promise<ApiResponse<T>> {
        const response = await fetch(baseUrl + endpoint, {
            method: "POST",
            credentials: 'include',
            body: body,
        });
        return handleResponse(response);
    },

    async putFormData<T>(endpoint: string, body: FormData): Promise<ApiResponse<T>> {
        const response = await fetch(baseUrl + endpoint, {
            method: "PUT",
            credentials: 'include',
            body: body,
        });
        return handleResponse(response);
    },

    async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
        const response = await fetch(baseUrl + endpoint, {
            method: "PUT",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        return handleResponse(response);
    },

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        const response = await fetch(baseUrl + endpoint, {
            method: 'DELETE',
            credentials: 'include',
        });
        return handleResponse(response);
    },
};

export default httpClient;
