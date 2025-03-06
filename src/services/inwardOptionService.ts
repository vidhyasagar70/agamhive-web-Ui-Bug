import axios from "axios";

const BASE_URL = "https://api-agamhive.agamvanigam.com/inwardoptions";

// Define the type for an inward option
export interface InwardOption {
  _id?: string;
  optionName: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

// Get stored token from local storage
const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Axios instance with authorization header
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to fetch all inward options
export const getInwardOptions = async (
  page: number = 1,
  limit: number = 10
): Promise<InwardOption[]> => {
  const token = getToken();
  const response = await apiClient.get(`?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data.data;
};

// Function to fetch a single inward option by ID
export const getInwardOptionById = async (id: string): Promise<InwardOption> => {
  const token = getToken();
  const response = await apiClient.get(`/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
};

// Function to create a new inward option
export const createInwardOption = async (
  newOption: InwardOption
): Promise<InwardOption> => {
  const token = getToken();
  const response = await apiClient.post("/", newOption, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
};

// Function to update an existing inward option
export const updateInwardOption = async (
  id: string,
  updatedOption: Partial<InwardOption>
): Promise<InwardOption> => {
  const token = getToken();
  const response = await apiClient.patch(`/${id}`, updatedOption, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
};

// Function to delete an inward option
export const deleteInwardOption = async (id: string): Promise<void> => {
  const token = getToken();
  await apiClient.delete(`/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
