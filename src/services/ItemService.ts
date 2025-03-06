import { ItemType, ItemResponse } from "../types/ItemTypes";
import { ApiResponse } from "../types/uomtypes";

// Helper function to get the auth token from localStorage
const getAuthToken = () => localStorage.getItem("authToken") || "";

// Get API URL from .env file
const API_URL = process.env.REACT_APP_API_URL || "https://api-agamhive.agamvanigam.com";

interface FetchParams {
    page?: number;
    limit?: number;
    search?: string;
}

/**
 * Fetch all items
 */
export const fetchItems = async (params: FetchParams = {}): Promise<ApiResponse<ItemResponse>> => {
    const token = getAuthToken();
    if (!token) return { error: "Unauthorized. Please log in." };

    try {
        const queryParams = new URLSearchParams({
            page: (params.page || 1).toString(),
            limit: (params.limit || 10).toString(),
            ...(params.search ? { search: params.search } : {})
        });

        const response = await fetch(`${API_URL}/items?${queryParams}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const jsonResponse = await response.json();
        if (!response.ok) {
            return { error: jsonResponse.msg || "Failed to fetch items" };
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

/**
 * Create a new item
 */
export const createItem = async (item: Omit<ItemType, 'status'>): Promise<ApiResponse<ItemType>> => {
    const token = getAuthToken();
    if (!token) return { error: "Unauthorized. Please log in." };

    try {
        const response = await fetch(`${API_URL}/items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(item),
        });

        const data = await response.json();
        return response.ok ? { data } : { error: data?.msg || "Failed to create item." };
    } catch (error) {
        return { error: "Network error. Please check your connection and try again." };
    }
};

/**
 * Update an existing item
 */
export async function updateItem(id: string, item: ItemType): Promise<ApiResponse<ItemType>> {
  const token = getAuthToken();
  if (!token) return { error: "Unauthorized. Please log in." };

  console.log("data from form field:",item)
  // Ensure request format exactly matches Swagger API spec
  const requestBody = {
    hsnCode: item.hsnCode,
    internalPartNo: item.internalPartNo,
    externalPartNo: item.externalPartNo,
    partName: item.partName,
    model: item.model,
    category: item.category,
    uom: item.uom,
    packingQty: item.packingQty,
    stockPerDay: item.stockPerDay,
    safetyDays: item.safetyDays,
    minReqDay: item.minReqDay,
    maxReqDays: item.maxReqDays,
    productionItem: item.productionItem,
    sellingItem: item.sellingItem,
    purchaseItem: item.purchaseItem,
    selfLife: item.selfLife,
    expiryDays: item.expiryDays,
    scheduleNo: item.scheduleNo,
    updatedAt: new Date().toISOString(), // Timestamp for tracking updates
  };

  console.log(`🔄 Updating item at: ${API_URL}/items/${id}`);
  console.log("📤 Request Body:", JSON.stringify(requestBody, null, 2));
  console.log("🔑 Auth Token:", token);

  try {
    const response = await fetch(`${API_URL}/items/${id}`, {
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
      return { error: data?.msg || "Failed to update item." };
    }

    return { data };
  } catch (error) {
    console.error("❌ Network error:", error);
    return { error: "Network error. Please try again." };
  }
}

/**
 * Delete an item
 */
export async function deleteItem(id: string): Promise<ApiResponse<null>> {
  const token = getAuthToken();
  if (!token) return { error: "Unauthorized. Please log in." };

  try {
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok ? { data: null } : { error: "Failed to delete item." };
  } catch (error) {
    return { error: "Network error. Please try again." };
  }
}
