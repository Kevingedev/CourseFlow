export interface User {
  id?: number;
  fullName: string;
  email: string;
  password?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
