import { ApiResponse, Rack, RacksResponse } from "../types/rack";

export interface FetchParams {
  page?: number;
  limit?: number;
  search?: string;
}


const API_URL = "https://api-agamhive.agamvanigam.com/racks";

/** Get Auth Headers */
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token not found. Please log in again.");
    throw new Error("Token not found. Please log in again.");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

/** Fetch Racks */
export const getRacks = async (params: FetchParams = {}): Promise<ApiResponse<RacksResponse>> => {
  const token = localStorage.getItem("token");
  if (!token) return { error: "Unauthorized. Please log in." };

  try {
    const queryParams = new URLSearchParams({
      page: (params.page || 1).toString(),
      limit: (params.limit || 10).toString(),
      ...(params.search ? { search: params.search } : {})
    });

    const response = await fetch(`${API_URL}?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const jsonResponse = await response.json();
    if (!response.ok) {
      return { error: jsonResponse.msg || "Failed to fetch racks" };
    }

    return {
      data: {
        racks: jsonResponse.data.racks || [],
        totalPages: Math.ceil(jsonResponse.data.total / (params.limit || 10)) || 1,
        total: jsonResponse.data.total,
      },
    };
  } catch (error) {
    return { error: "Network error. Please try again." };
  }
};



/** Create Rack */
export const createRack = async (rack: Rack): Promise<Rack> => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(rack),
    });
    if (!response.ok) throw new Error(`Failed to create rack: ${response.statusText}`);

    const data = await response.json();
    return { id: data.rack._id, rackName: data.rack.rackName, status: data.rack.status };
  } catch (error: any) {
    console.error("Error creating rack:", error.message);
    throw error;
  }
};

/** Update Rack */
export const updateRack = async (id: number, updatedRack: Partial<Rack>): Promise<Rack> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedRack),
    });
    if (!response.ok) throw new Error(`Failed to update rack: ${response.statusText}`);

    return await response.json();
  } catch (error: any) {
    console.error("Error updating rack:", error.message);
    throw error;
  }
};

/** Delete Rack */
export const deleteRack = async (id: number): Promise<void> => {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE", headers: getAuthHeaders() });
  } catch (error: any) {
    console.error("Error deleting rack:", error.message);
    throw error;
  }
};
