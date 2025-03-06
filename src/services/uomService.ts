import { UOM, UOMResponse, ApiResponse } from "../types/uomtypes";

// Helper function to get the auth token from localStorage
const getAuthToken = () => localStorage.getItem("authToken") || "";

// Get API URL from .env file
const API_URL = process.env.REACT_APP_API_URL || "https://api-agamhive.agamvanigam.com";

interface FetchParams {
    page?: number;
    limit?: number;
    search?: string;
}

// Fetch UOMs with pagination
export const fetchUomData = async (params: FetchParams = {}): Promise<ApiResponse<UOMResponse>> => {
    const token = getAuthToken();
    if (!token) return { error: "Unauthorized. Please log in." };

    try {
        const queryParams = new URLSearchParams({
            page: (params.page || 1).toString(),
            limit: (params.limit || 10).toString(),
            ...(params.search ? { search: params.search } : {})
        });

        const response = await fetch(`${API_URL}/uoms?${queryParams}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const jsonResponse = await response.json();
        if (!response.ok) {
            return { error: jsonResponse.msg || "Failed to fetch UOMs" };
        }

        return {
            data: {
                items: jsonResponse.data.data || [],
                totalPages: Math.ceil(jsonResponse.data.total / params.limit!) || 1,
                total: jsonResponse.data.total
            }
        };
    } catch (error) {
        return { error: "Network error. Please try again." };
    }
};

// Create UOM without status
export const createUom = async (uom: Omit<UOM, 'status'>): Promise<ApiResponse<UOM>> => {
    const token = getAuthToken();
    if (!token) return { error: "Unauthorized. Please log in." };

    try {
        const response = await fetch(`${API_URL}/uoms`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(uom),
        });

        const data = await response.json();
        return response.ok ? { data } : { error: data?.msg || "Failed to create UOM." };
    } catch (error) {
        return { error: "Network error. Please check your connection and try again." };
    }
};

// Update UOM
export const updateUom = async (id: string, uom: UOM): Promise<ApiResponse<UOM>> => {
    const token = getAuthToken();
    if (!token) return { error: "Unauthorized. Please log in." };

    const requestBody = {
        code: uom.code,
        name: uom.name,
        status: uom.status,
        updatedAt: new Date().toISOString(),
    };

    try {
        const response = await fetch(`${API_URL}/uoms/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        if (!response.ok) {
            return { error: data?.msg || "Failed to update UOM." };
        }

        return { data };
    } catch (error) {
        return { error: "Network error. Please try again." };
    }
};

// Delete UOM
export const deleteUom = async (id: string): Promise<ApiResponse<null>> => {
    const token = getAuthToken();
    if (!token) return { error: "Unauthorized. Please log in." };

    try {
        const response = await fetch(`${API_URL}/uoms/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.ok ? { data: null } : { error: "Failed to delete UOM." };
    } catch (error) {
        return { error: "Network error. Please try again." };
    }
};

