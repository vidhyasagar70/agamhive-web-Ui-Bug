export interface OutwardOption {
  _id: string;
  optionName: string;
  status: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface OutwardOptionsResponse {
  data: OutwardOption[];
  totalPages: number;
  total: number;
}