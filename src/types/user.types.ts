export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // In production, this would be hashed on the backend
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export type LoginCredentials = {
  email: string;
  password: string;
};

export type SignupData = {
  name: string;
  email: string;
  password: string;
};
