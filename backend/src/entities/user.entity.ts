export interface User {
  id: string;
  name: string;
  email: string;
  role?: "user" | "admin";
  phone?: string | null;
  address?: string | null;
  profileImageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  phone?: string | null;
  address?: string | null;
  profileImageUrl?: string | null;
}

export interface UserWithPassword extends User {
  passwordHash: string;
  tokenVersion: number;
}
