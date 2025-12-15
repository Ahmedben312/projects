// /backend/src/types/index.ts

export enum UserRole {
  Admin = "admin",
  Librarian = "librarian",
  Member = "member",
}

export interface IBook {
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
  coverImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBorrowRecord {
  userId: string;
  bookId: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: "borrowed" | "returned" | "overdue";
  renewalCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  membershipId: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  borrowedBooks: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Input types
export interface BookCreateInput {
  title: string;
  author: string;
  isbn: string;
  genre: string | string[];
  publicationYear: number;
  publisher?: string;
  copiesAvailable: number;
  totalCopies: number;
  description?: string;
  language?: string;
  pages?: number;
  coverImage?: string;
}

export interface BookUpdateInput extends Partial<BookCreateInput> {
}

export interface UserCreateInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  membershipId: string;
  phone?: string;
  address?: string;
}

export interface UserUpdateInput extends Partial<UserCreateInput> {
  isActive?: boolean;
	borrowedBooks?: string[];
}

// Filter and pagination types
export interface FilterOptions {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  [key: string]: any;
}

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
