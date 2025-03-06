export interface UOM {
    _id?: string;  // Optional for updates/deletes
    code: string;
    name: string;
    status: string;
    createdAt?: string;
  }
  
  export interface UOMResponse {
    items: UOM[];
    totalPages: number;
    total?: number;
  }
  
  export interface ApiResponse<T> {
    error?: string;
    data?: T;
  }
 
  