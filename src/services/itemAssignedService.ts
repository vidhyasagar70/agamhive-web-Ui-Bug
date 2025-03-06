// src/services/itemAssignedService.ts

import { ApiResponse } from "../types/uomtypes";

const API_URL = "https://api-agamhive.agamvanigam.com/itemassignedracks";

// Helper function to get the auth token from localStorage
const getAuthToken = () => localStorage.getItem("authToken") || "";

/**
 * Create a new item assignment
 */
export const createItemAssignment = async (itemId: string, rackId: string): Promise<ApiResponse<any>> => {
    const token = getAuthToken();
    if (!token) return { error: "Unauthorized. Please log in." };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ itemId, rackId }), // Send both itemId and rackId
        });

        const data = await response.json();
        return response.ok ? { data } : { error: data?.msg || "Failed to create item assignment." };
    } catch (error) {
        return { error: "Network error. Please check your connection and try again." };
    }
};

/**
 * Fetch all item assignments
 */
export const fetchItemAssignments = async (page: number = 1, limit: number = 10): Promise<ApiResponse<any>> => {
    const token = getAuthToken();
    if (!token) return { error: "Unauthorized. Please log in." };

    try {
        const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const jsonResponse = await response.json();
        if (!response.ok) {
            return { error: jsonResponse.msg || "Failed to fetch item assignments" };
        }

        return {
            data: jsonResponse.data.data || [],
        };
    } catch (error) {
        return { error: "Network error. Please try again." };
    }
};

/**
 * Update an existing item assignment (including marking as inactive)
 */
export const updateItemAssignment = async (id: string, itemId: string = "", rackId: string = "", status: string = "ACTIVE"): Promise<ApiResponse<any>> => {
    const token = getAuthToken();
    if (!token) return { error: "Unauthorized. Please log in." };

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ itemId, rackId, status }), // Send updated itemId, rackId, and status
        });

        const data = await response.json();
        return response.ok ? { data } : { error: data?.msg || "Failed to update item assignment." };
    } catch (error) {
        return { error: "Network error. Please check your connection and try again." };
    }
};