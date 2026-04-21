import { User } from "./user";
 
export interface AuthUser {
  id: number;
  email?: string;
  role?: string;
}

export interface JwtPayload {
  id: number;
  email?: string;
  role?: string;
}

export interface LoginResponse {
  user: Omit<User, "password">;
  token: string;
}
