export interface ItemAssignedRack {
  id?: number;
  optionName: string;
  status: string;
}

const API_URL = "https://api-agamhive.agamvanigam.com/itemassignedracks";

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

/** Fetch Item Assigned Racks */
export const getItemAssignedRacks = async (): Promise<ItemAssignedRack[]> => {
  try {
    const response = await fetch(`${API_URL}?page=1&limit=10`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Failed to fetch item assigned racks: ${response.statusText}`);

    const result = await response.json();
    if (!result || !result.data || !Array.isArray(result.data.itemAssignedRacks)) {
      throw new Error("Invalid response structure. Expected { data: { itemAssignedRacks: [...] } }.");
    }

    return result.data.itemAssignedRacks.map((rack: any) => ({
      id: rack._id,
      optionName: rack.optionName,
      status: rack.status,
    }));
  } catch (error: any) {
    console.error("Error fetching item assigned racks:", error.message);
    throw error;
  }
};

/** Create Item Assigned Rack */
export const createItemAssignedRack = async (rack: ItemAssignedRack): Promise<ItemAssignedRack> => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(rack),
    });
    if (!response.ok) throw new Error(`Failed to create item assigned rack: ${response.statusText}`);

    const data = await response.json();
    return { id: data.rack._id, optionName: data.rack.optionName, status: data.rack.status };
  } catch (error: any) {
    console.error("Error creating item assigned rack:", error.message);
    throw error;
  }
};

/** Update Item Assigned Rack */
export const updateItemAssignedRack = async (id: number, updatedRack: Partial<ItemAssignedRack>): Promise<ItemAssignedRack> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedRack),
    });
    if (!response.ok) throw new Error(`Failed to update item assigned rack: ${response.statusText}`);

    return await response.json();
  } catch (error: any) {
    console.error("Error updating item assigned rack:", error.message);
    throw error;
  }
};

/** Delete Item Assigned Rack */
export const deleteItemAssignedRack = async (id: number): Promise<void> => {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE", headers: getAuthHeaders() });
  } catch (error: any) {
    console.error("Error deleting item assigned rack:", error.message);
    throw error;
  }
};
