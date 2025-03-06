import axios, { AxiosRequestConfig } from "axios";

const API_URL = process.env.REACT_APP_API_URL || "https://api-agamhive.agamvanigam.com";

// Helper function to get the auth token
const getAuthToken = () => localStorage.getItem("authToken") || "";

// Axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add Authorization header
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Generic GET request to fetch data with params
 * @param endpoint API endpoint (e.g., "/items")
 * @param params Query parameters (e.g., { page: 1, limit: 10 })
 */
export const getData = async <T>(endpoint: string, params: object = {}): Promise<T | null> => {
  try {
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error("GET Error:", error);
    return null;
  }
};

/**
 * Generic POST request to create data
 * @param endpoint API endpoint (e.g., "/items")
 * @param data Request payload
 */
export const postData = async <T>(endpoint: string, data: object): Promise<T | null> => {
  try {
    const response = await apiClient.post(endpoint, data);
    console.log("response from post method: ",response);
    
    return response.data;
  } catch (error) {
    console.error("POST Error:", error);
    return null;
  }
};

/**
 * Generic PUT request to update data
 * @param endpoint API endpoint with ID (e.g., "/items/:id")
 * @param id Resource ID
 * @param data Updated payload
 */
export const putData = async <T>(endpoint: string, id: string, data: object): Promise<T | null> => {

  try {
    const response = await apiClient.put(`${endpoint}/${id}`, data);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("PUT Error:", error);
    return null;
  }
};

/**
 * Generic PATCH request to update partial data
 * @param endpoint API endpoint with ID (e.g., "/items/:id")
 * @param id Resource ID
 * @param data Updated fields
 */
export const patchData = async <T>(endpoint: string, id: string, data: object): Promise<T | null> => {
  try {
    const response = await apiClient.patch(`${endpoint}/${id}`, data);
    console.log(response);
    
    return response.data;
  } catch (error) {
    console.error("PATCH Error:", error);
    return null;
  }
};

/**
 * Generic DELETE request
 * @param endpoint API endpoint with ID (e.g., "/items/:id")
 * @param id Resource ID to delete
 */
export const deleteData = async (endpoint: string, id: string): Promise<boolean> => {
  try {
    const response = await apiClient.delete(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error("DELETE Error:", error);
    return false;
  }
};
