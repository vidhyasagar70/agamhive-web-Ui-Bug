import { ItemCategory, ItemCategoryResponse, ApiResponse } from "../types/ItemCategoryTypes";



const getAuthToken = () => localStorage.getItem("authToken") || "";

const API_URL = process.env.REACT_APP_API_URL || "https://api-agamhive.agamvanigam.com";

interface FetchParams {
    page?: number;
    limit?: number;
    search?: string;
}


export const fetchItemCategoryData = async (params: FetchParams = {}): Promise<ApiResponse<ItemCategoryResponse>> => {
    const token = getAuthToken();
    if (!token) return { error: "Unauthorized. Please log in." };

    try {
        const queryParams = new URLSearchParams({
            page: (params.page || 1).toString(),
            limit: (params.limit || 10).toString(),
            ...(params.search ? { search: params.search } : {})
        });

        const response = await fetch(`${API_URL}/itemcategorys?${queryParams}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const jsonResponse = await response.json();
        if (!response.ok) {
            return { error: jsonResponse.msg || "Failed to fetch item categories" };
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

export async function createItemCategory(itemcategory: Omit<ItemCategory, 'status'>): Promise<ApiResponse<ItemCategory>> {
  const token = getAuthToken();
  if (!token) return { error: "Unauthorized. Please log in." };

  try {
    const response = await fetch(`${API_URL}/itemcategorys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(itemcategory),
    });

    const data = await response.json();
    return response.ok ? { data } : { error: data?.msg || "Failed to create itemcategory." };
  } catch (error) {
    return { error: "Network error. Please check your connection and try again." };
  }
}


export async function updateItemCategory(id: string, itemcategory: ItemCategory): Promise<ApiResponse<ItemCategory>> {
    const token = getAuthToken();
    if (!token) return { error: "Unauthorized. Please log in." };
  
  
    const requestBody = {
      code: itemcategory.code,
      name: itemcategory.name,
      status: itemcategory.status,
      updatedAt: new Date().toISOString(), 
    };
  
    console.log(` Updating UOM at: ${API_URL}/itemcategorys/${id}`);
    console.log("Request Body:", JSON.stringify(requestBody, null, 2));
    console.log("Auth Token:", token);
  
    try {
      const response = await fetch(`${API_URL}/itemcategorys/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
      console.log(" API Response:", data);
  
      if (!response.ok) {
        console.error(" Update Failed:", data?.msg || "Unknown error");
        return { error: data?.msg || "Failed to update itemcategory." };
      }
  
      return { data };
    } catch (error) {
      console.error(" Network error:", error);
      return { error: "Network error. Please try again." };
    }
  }
  


export async function deleteItemCategory(id: string): Promise<ApiResponse<null>> {
  const token = getAuthToken();
  if (!token) return { error: "Unauthorized. Please log in." };

  try {
    const response = await fetch(`${API_URL}/itemcategorys/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok ? { data: null } : { error: "Failed to delete itemcategory." };
  } catch (error) {
    return { error: "Network error. Please try again." };
  }
}
