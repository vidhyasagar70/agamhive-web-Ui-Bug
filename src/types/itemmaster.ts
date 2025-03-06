export interface ItemMaster {
    _id: string;
    code: string;
    name: string;
    status: string;
    createdAt?: string;
    model: { _id: string; name: string };
    category: { _id: string; name: string };
    uom: { _id: string; name: string };
  }
  
  export interface ApiResponse<T> {
    error?: string;
    data?: T;
  }
  