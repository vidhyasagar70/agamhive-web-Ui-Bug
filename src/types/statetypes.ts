export interface State {
  _id?: string;
  gstCode: string;
  statName: string;
  status: string;
  createdAt?: string;

}

export interface stateResponse {
  data: State[];
  totalPages: number;
  total?: number;
}

export interface ApiResponse<T> {
  error?: string;
  data?: T;
}

