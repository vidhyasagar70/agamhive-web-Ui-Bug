export interface SignInResponse {
    token?: string;
    error?: string;
  }
  
  export interface SignInRequest {
    email: string;
    password: string;
  }
  