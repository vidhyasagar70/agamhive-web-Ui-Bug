export interface Country {
    _id?: string;  // Optional for updates/deletes
    countryCode: string;
    countryName: string;
    status: string;
    createdAt?: string;
  }
  
  export interface CountryResponse {
    data: Country[];
    totalPages: number;
    total?: number;
  }
  
  export interface ApiResponse<T> {
    error?: string;
    data?: T;
  }
 
  