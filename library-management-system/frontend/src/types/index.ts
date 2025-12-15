export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string[];
  publicationYear: number;
  publisher?: string;
  copiesAvailable: number;
  totalCopies: number;
  description?: string;
  language?: string;
  pages?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  membershipId: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  borrowedBooks: string[];
}

export enum UserRole {
  ADMIN = "admin",
  LIBRARIAN = "librarian",
  MEMBER = "member",
}

export interface BorrowRecord {
  _id: string;
  bookId: string;
  userId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: "borrowed" | "returned" | "overdue";
  renewalCount: number;
  book?: Book;
  user?: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterOptions {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  [key: string]: any;
}
