import { ItemModel, ItemModelResponse, ApiResponse } from "../types/ItemModelTypes";
import { UOM } from "../types/uomtypes";

// Helper function to get the auth token from localStorage
const getAuthToken = () => localStorage.getItem("authToken") || "";

// Get API URL from .env file
const API_URL = process.env.REACT_APP_API_URL || "https://api-agamhive.agamvanigam.com";

interface FetchParams {
    page?: number;
    limit?: number;
    search?: string;
}

// Fetch Item Models with pagination
export const fetchItemModelData = async (params: FetchParams = {}): Promise<ApiResponse<ItemModelResponse>> => {
    const token = getAuthToken();
    if (!token) return { error: "Unauthorized. Please log in." };

    try {
        const queryParams = new URLSearchParams({
            page: (params.page || 1).toString(),
            limit: (params.limit || 10).toString(),
            ...(params.search ? { search: params.search } : {})
        });

        const response = await fetch(`${API_URL}/itemmodels?${queryParams}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const jsonResponse = await response.json();
        if (!response.ok) {
            return { error: jsonResponse.msg || "Failed to fetch item models" };
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

// Create a new UOM
export const createItemModel = async (itemModel: Omit<ItemModel, 'status'>): Promise<ApiResponse<ItemModel>> => {
  const token = getAuthToken();
  if (!token) return { error: "Unauthorized. Please log in." };

  try {
    const response = await fetch(`${API_URL}/itemmodels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(itemModel),
    });

    const data = await response.json();
    return response.ok ? { data } : { error: data?.msg || "Failed to create item model." };
  } catch (error) {
    return { error: "Network error. Please check your connection and try again." };
  }
};

// Update a UOM
export async function updateItemModel(id: string, itemModel: ItemModel): Promise<ApiResponse<ItemModel>> {
    const token = getAuthToken();
    if (!token) return { error: "Unauthorized. Please log in." };
  
    // ✅ Ensure request format exactly matches Swagger
    const requestBody = {
      code: itemModel.code,
      name: itemModel.name,
      status: itemModel.status,
      updatedAt: new Date().toISOString(), // Some APIs require timestamps
    };
  
    console.log(`🔄 Updating UOM at: ${API_URL}/itemmodels/${id}`);
    console.log("📤 Request Body:", JSON.stringify(requestBody, null, 2));
    console.log("🔑 Auth Token:", token);
  
    try {
      const response = await fetch(`${API_URL}/itemmodels/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
      console.log("📥 API Response:", data);
  
      if (!response.ok) {
        console.error("❌ Update Failed:", data?.msg || "Unknown error");
        return { error: data?.msg || "Failed to update itemModel." };
      }
  
      return { data };
    } catch (error) {
      console.error("❌ Network error:", error);
      return { error: "Network error. Please try again." };
    }
  }
  

// Delete a UOM
export async function deleteItemModel(id: string): Promise<ApiResponse<null>> {
  const token = getAuthToken();
  if (!token) return { error: "Unauthorized. Please log in." };

  try {
    const response = await fetch(`${API_URL}/itemmodels/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok ? { data: null } : { error: "Failed to delete itemModel." };
  } catch (error) {
    return { error: "Network error. Please try again." };
  }
}
