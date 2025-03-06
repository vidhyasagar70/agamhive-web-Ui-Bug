import { ApiResponse, OutwardOption, OutwardOptionsResponse } from "../types/outwardOption";

const API_URL = "https://api-agamhive.agamvanigam.com/outwardoptions";

export interface FetchParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const fetchOutwardOptions = async (params: FetchParams = {}): Promise<ApiResponse<OutwardOptionsResponse>> => {
  const token = localStorage.getItem("token");
  if (!token) return { error: "Unauthorized. Please log in." };

  try {
    const queryParams = new URLSearchParams({
      page: (params.page || 1).toString(),
      limit: (params.limit || 10).toString(),
      ...(params.search ? { search: params.search } : {}),
    });

    const response = await fetch(`${API_URL}?${queryParams}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

   
    
    const jsonResponse = await response.json();
    if (!response.ok) {
      return { error: jsonResponse.msg || "Failed to fetch outward options" };
    }
    console.log(jsonResponse);

    return {
      data: {
        data: jsonResponse.data.data || [],
        totalPages: Math.ceil(jsonResponse.data.total / (params.limit || 10)) || 1,
        total: jsonResponse.data.total,
      },
    };
  } catch (error) {
    return { error: "Network error. Please try again." };
  }
};

export const createOutwardOption = async (data: Partial<OutwardOption>): Promise<OutwardOption | null> => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No auth token found.");
    return null;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    console.log(response);
    

    if (!response.ok) throw new Error("Failed to create outward option");
    return await response.json();
  } catch (error) {
    console.error("Error creating outward option:", error);
    return null;
  }
};

export const updateOutwardOption = async (id: string, data: Partial<OutwardOption>): Promise<OutwardOption | null> => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No auth token found.");
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Failed to update outward option with ID ${id}`);
    return await response.json();
  } catch (error) {
    console.error("Error updating outward option:", error);
    return null;
  }
};

export const deleteOutwardOption = async (id: string): Promise<boolean> => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No auth token found.");
    return false;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`Failed to delete outward option with ID ${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting outward option:", error);
    return false;
  }
};
