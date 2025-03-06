export interface Rack {
    id?: number;
    rackName: string;
    status: string;
  }
  

  export interface ApiResponse<T> {
    data?: T;
    error?: string;
  }
  
  export interface RacksResponse {
    racks: Rack[];
    totalPages: number;
    total: number;
  }