export interface ItemCategory {
    _id?: string;  
    code: string;
    name: string;
    status: string;
    icon?: string;  
    createdAt?: string;
  }
  
  export interface ItemCategoryResponse {
    items: ItemCategory[];
    totalPages: number;
    total?: number;
  }
  
  export interface ApiResponse<T> {
    error?: string;
    data?: T;
  }
  