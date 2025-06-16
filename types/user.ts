export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserResponse extends Omit<User, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
} 