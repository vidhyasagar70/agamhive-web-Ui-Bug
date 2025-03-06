export interface ItemModel {
    _id?: string;  // Optional for updates/deletes
    code: string;
    name: string;
    status: string;
    createdAt?: string;
  }
  
  export interface ItemModelResponse {
    items: ItemModel[];
    totalPages: number;
    total?: number;
  }
  
  export interface ApiResponse<T> {
    error?: string;
    data?: T;
  }
  