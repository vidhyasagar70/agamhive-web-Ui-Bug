import { SignInResponse } from "../types/authTypes";

const API_URL = process.env.REACT_APP_API_URL || "https://api-agamhive.agamvanigam.com";

export async function signInUser(email: string, password: string): Promise<SignInResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    return { error: data?.msg || "Invalid credentials. Please try again." };
  }
  if (data?.data?.token) {
    localStorage.setItem("token", data.data.token); 
    console.log("Token stored:", data.data.token);
  }

  return { token: data.data.token };
}
